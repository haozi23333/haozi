---
title: 部署letsencrypt的服务端boulder
date: 2019-08-30 10:32:51
tags:
	- k8s
	- 笔记
	- 证书
---

# 部署letsencrypt的服务端boulder

为了方便内网的 k8s 使用 cert-Manager 正常的签发非正常的域名. 所以这里我们尝试自己搭建, letsencrypt 的服务端 boulder

{% githubCard user:letsencrypt repo:boulder %}

<!--more-->



## 介绍

没啥好介绍的, 放个功能模块图吧

```no_highlight
                            +--------- OCSP Updater
                             |               |
                             v               |
                            CA -> Publisher  |
                             ^               |
                             |               v
       Subscriber -> WFE --> RA --> SA --> MariaDB
                             |               ^
Subscriber server <- VA <----+               |
                                             |
          Browser ------------------>  OCSP Responder

```



## 安装

这里直接使用 boulder 官方提供的 docker-compose.yml,  子组件蛮多的懒得自己搭建了

> 官方要求宿主机可用内存大于 **2**G

把项目 clone 先 clone 下来

```
git clone git@github.com:letsencrypt/boulder.git
```

编辑 `docker-compose.yml`里面大部分是不用动的, 这个 docker compose 的配置, 是调用的 `test/config`文件夹里面的配置文件.

* 修改 `FAKE_DNS` 为你的 DNS
* 其他的有需要就修改

```yaml
version: '3'
services:
    boulder:
        # To minimize fetching this should be the same version used below
        image: letsencrypt/boulder-tools-go${TRAVIS_GO_VERSION:-1.12.8}:2019-08-28
        environment:
            FAKE_DNS: 10.77.77.77
            PKCS11_PROXY_SOCKET: tcp://boulder-hsm:5657
            BOULDER_CONFIG_DIR: test/config
            GO111MODULE: "on"
            GOFLAGS: "-mod=vendor"
        volumes:
          - .:/go/src/github.com/letsencrypt/boulder
          - ./.gocache:/root/.cache/go-build
        networks:
          bluenet:
            ipv4_address: 10.77.77.77
            aliases:
              - sa1.boulder
              - ca1.boulder
              - ra1.boulder
              - va1.boulder
              - publisher1.boulder
              - ocsp-updater.boulder
              - admin-revoker.boulder
              - nonce1.boulder
          rednet:
            ipv4_address: 10.88.88.88
            aliases:
              - sa2.boulder
              - ca2.boulder
              - ra2.boulder
              - va2.boulder
              - publisher2.boulder
              - nonce2.boulder
        # Use sd-test-srv as a backup to Docker's embedded DNS server
        # (https://docs.docker.com/config/containers/container-networking/#dns-services).
        # If there's a name Docker's DNS server doesn't know about, it will
        # forward the query to this IP (running sd-test-srv). We have
        # special logic there that will return multiple IP addresses for
        # service names.
        dns: 10.77.77.77
        ports:
          - 4000:4000 # ACME
          - 4001:4001 # ACMEv2
          - 4002:4002 # OCSP
          - 4003:4003 # OCSP
          - 4430:4430 # ACME via HTTPS
          - 4431:4431 # ACMEv2 via HTTPS
          - 8055:8055 # dns-test-srv updates
        depends_on:
          - bhsm
          - bmysql
        entrypoint: test/entrypoint.sh
        working_dir: /go/src/github.com/letsencrypt/boulder
    bhsm:
        # To minimize fetching this should be the same version used above
        image: letsencrypt/boulder-tools-go${TRAVIS_GO_VERSION:-1.12.8}:2019-08-28
        environment:
            PKCS11_DAEMON_SOCKET: tcp://0.0.0.0:5657
        command: /usr/local/bin/pkcs11-daemon /usr/lib/softhsm/libsofthsm2.so
        expose:
          - 5657
        networks:
          bluenet:
            aliases:
              - boulder-hsm
    bmysql:
        image: mariadb:10.3
        networks:
          bluenet:
            aliases:
              - boulder-mysql
        environment:
            MYSQL_ALLOW_EMPTY_PASSWORD: "yes"
        command: mysqld --bind-address=0.0.0.0
        logging:
            driver: none
    netaccess:
        image: letsencrypt/boulder-tools-go${TRAVIS_GO_VERSION:-1.12.8}:2019-08-28
        environment:
            GO111MODULE: "on"
            GOFLAGS: "-mod=vendor"
        networks:
          - bluenet
        volumes:
          - .:/go/src/github.com/letsencrypt/boulder
        working_dir: /go/src/github.com/letsencrypt/boulder
        entrypoint: test/entrypoint-netaccess.sh
        depends_on:
          - bmysql

networks:
  bluenet:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 10.77.77.0/24
  rednet:
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 10.88.88.0/24

```

## 秘钥部分

秘钥这部分有点麻烦详情见 [boulder/test/PKI.md](https://github.com/letsencrypt/boulder/blob/master/test/PKI.md) 这里面详细介绍了秘钥部分

进入 `boulder/test/grpc-creds`文件夹, 删除目录下的两个秘钥, 将上次签名用的 2 个公私钥修改名字为` minica-key.pem`和`minica.pem`, 删除以下文件夹内公私钥

```
rm -f */*.pem
```

运行 同目录下的`generate.sh`

如果提示 

```sh
➜ ./generate.sh
+ command -v minica
+ echo 'No '\''minica'\'' command available.'
No 'minica' command available.
+ echo 'Check your GOPATH and run: '\''go get github.com/jsha/minica'\''.'
Check your GOPATH and run: 'go get github.com/jsha/minica'.
+ exit 1
```

缺少一个 `minica`, 安装方式 `go get github.com/jsha/minica`, 前提是你电脑安装了 golang, 如果没有安装先安装, MAC 安装完的目录为 `/Users/haozi/go/bin/minica`记得先加到环境变量里面, 再次运行`generate.sh`

```sh
➜ ./generate.sh
+ command -v minica
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains admin-revoker.boulder
2019/08/31 10:39:15 reading private key from minica-key.pem: incorrect PEM type EC PRIVATE KEY
```

翻翻代码判断了个啥, [代码](https://github.com/jsha/minica/blob/master/main.go#L77)

```go
func readPrivateKey(keyContents []byte) (crypto.Signer, error) {
	block, _ := pem.Decode(keyContents)
	if block == nil {
		return nil, fmt.Errorf("no PEM found")
	} else if block.Type != "RSA PRIVATE KEY" && block.Type != "ECDSA PRIVATE KEY" {
		return nil, fmt.Errorf("incorrect PEM type %s", block.Type)
	}
	return x509.ParsePKCS1PrivateKey(block.Bytes)
}
```

必须是  `RSA`或者 `ECDSA`的 Private Key,  我们这个是 EC 的,  那我们重新生成一本证书吧

```
openssl genrsa -out ~/ca/ca.key.pem 2048
```

```
openssl req -new -key ~/ca/ca.key.pem -new -x509 -days 3650 -sha256 -extensions v3_ca -out ~/ca/ca.cert.pem
```

> 后面发现是复制错 key 了, 囧

运行 `./generate.sh`

```
➜ ./generate.sh
+ command -v minica
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains admin-revoker.boulder
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains expiration-mailer.boulder
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains ocsp-updater.boulder
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains orphan-finder.boulder
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains wfe.boulder
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains akamai-purger.boulder
+ for HOSTNAME in admin-revoker.boulder expiration-mailer.boulder ocsp-updater.boulder orphan-finder.boulder wfe.boulder akamai-purger.boulder nonce.boulder
+ minica -domains nonce.boulder
+ for SERVICE in publisher ra ca sa va
+ minica -domains publisher.boulder,publisher1.boulder,publisher2.boulder
+ for SERVICE in publisher ra ca sa va
+ minica -domains ra.boulder,ra1.boulder,ra2.boulder
+ for SERVICE in publisher ra ca sa va
+ minica -domains ca.boulder,ca1.boulder,ca2.boulder
+ for SERVICE in publisher ra ca sa va
+ minica -domains sa.boulder,sa1.boulder,sa2.boulder
+ for SERVICE in publisher ra ca sa va
+ minica -domains va.boulder,va1.boulder,va2.boulder
```

可以看到所有的证书都已经重新生成好了