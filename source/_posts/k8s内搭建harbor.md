---
title: k8s内搭建harbor
tags:
  - k8s
  - 笔记
date: 2019-08-29 21:32:51
---


# k8s内搭建harbor

因为letsencrypt的服务端boulder需要进行打包, 所以先把内网的 harbor registry 先恢复了, 这里使用的是 NFS 做持久化



<!--more-->

## 准备

我的服务器是 Tower , 内置了 NFS 服务, 没啥好准备的, 创建一个 Share 即可



检测 nfs 是否开启, 使用 `showmount`

```sh
~/temp at ☸️  kubernetes-admin@kubernetes
➜ showmount -e 192.168.50.49
Exports list on 192.168.50.49:
/mnt/user/steam_libary              *
/mnt/user/harbor_registry           *
```

可以看见有两个这里使用 `harbor_registry`



##创建  PV 

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: nfs-registry-pv
  labels:
    pv: nfs-pv
spec:
  capacity:
    storage: 200Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  nfs:
    path: /mnt/user/harbor_registry
    server: 192.168.50.49
```

apply 执行之后, 运行`kubectl get pv`查询是否创建成功

```sh
k8s/nfs/harbor at ☸️  kubernetes-admin@kubernetes
➜ kubectl get pv
NAME              CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   REASON   AGE
nfs-registry-pv   200Gi      RWX            Retain           Available                                   51s
```



## 创建 PVC

```yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: nfs-registry-pvc
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 200Gi
  selector:
    matchLabels:
      pv: nfs-pv
```

apply 执行之后, 运行`kubectl get pvc`查询是否创建成功

```sh
k8s/nfs/harbor at ☸️  kubernetes-admin@kubernetes
➜ kubectl get pvc
NAME               STATUS   VOLUME            CAPACITY   ACCESS MODES   STORAGECLASS   AGE
nfs-registry-pvc   Bound    nfs-registry-pv   200Gi      RWX                           3s
```



## 申请 SSL 证书

这个地方随意可以按照前文自建 CA 签发, 也可以找其他的 也可以通过 cert-manager进行签发, 这个就按照自己需要



一共 2 张证书分别为

* core 的 `harbor.haozi.local`
* notray: `notray.harbor.haozi.local`

把申请好的证书安装到 k8s 内

```
kubectl create secret tls harbar-ssl --cert=cert.pem --key=key.pem -n kube-ops
kubectl create secret tls harbor-harbar-ssl --cert=cert.pem --key=key.pem -n kube-ops
```

这里记住名字

## 安装 harbor

新版本的 harbor 已经放弃了直接手动安装, 需要使用`harbor-helm`这么个玩意

{% githubCard user:goharbor repo:harbor-helm %}

### 安装 helm

{% githubCard user:helm repo:helm %}

跟着官方文档走就行了, 先把二进制包下载下来

```sh
 tar -zxvf helm-v2.14.3-linux-amd64.tar.gz #解压
 mv linux-amd64/helm /usr/local/bin/helm   #移动文件到 bin
 mv linux-amd64/tiller /usr/local/bin/tiller#移动文件到 bin
```

执行`helm init --history-max 200`

下方大部分引用自[kubernetes之helm简介、安装、配置、使用指南](https://blog.csdn.net/bbwangj/article/details/81087911)(以下 Helm 的安装为CSDN博主「菲宇」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。)

创建 Kubernetes 的服务帐号和绑定角色

```sh
kubectl create serviceaccount --namespace kube-system tiller
kubectl create clusterrolebinding tiller-cluster-rule --clusterrole=cluster-admin --serviceaccount=kube-system:tiller
```

为 Tiller 设置帐号

```sh
# 使用 kubectl patch 更新 API 对象
$ kubectl patch deploy --namespace kube-system tiller-deploy -p '{"spec":{"template":{"spec":{"serviceAccount":"tiller"}}}}'
```

查看是否授权成功

```sh
[root@haozi ~]# kubectl get deploy --namespace kube-system   tiller-deploy  --output yaml|grep  serviceAccount
      serviceAccount: tiller
      serviceAccountName: tiller
```

验证 Tiller 是否安装成功, 这一步大概需要 1 分钟左右 `kubectl -n kube-system get pods|grep tiller`

```sh
[root@haozi ~]# kubectl -n kube-system get pods|grep tiller
tiller-deploy-6b9c575bfc-hmx4c             1/1     Running   0          89s
```





### 安装 Ingress

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
```

### 安装 harbor

下载 `harbor-helm` 源码

```
git clone https://github.com/goharbor/harbor-helm.git
git checkout 1.1.0 # 这里自己看一下当前版本是多少
```

> 这里要注意一件事情不能使用 Master 分支的代码, 我试过了跑不起来, 解决了好久

修改 `values.yaml`

下面主要修改这几个地方

* expose -> tls -> secretName   这个是 Core SSL 证书 填上面安装的secret名称
* expose -> tls -> notarySecretName 这个是 notary SSL 填上面安装的secret名称
* expose -> ingress -> hosts->core 访问的域名
* expose -> ingress -> hosts->notary 域名
* persistence -> persistentVolumeClaim 里面每一个的 storageClass, 其他的删掉
* externalURL   访问的网址
* harborAdminPassword   系统密码
* secretKey   秘钥

其他的按需修改

```yaml
expose:
  # Set the way how to expose the service. Set the type as "ingress",
  # "clusterIP", "nodePort" or "loadBalancer" and fill the information
  # in the corresponding section
  type: ingress
  tls:
    # Enable the tls or not. Note: if the type is "ingress" and the tls
    # is disabled, the port must be included in the command when pull/push
    # images. Refer to https://github.com/goharbor/harbor/issues/5291
    # for the detail.
    enabled: true
    # Fill the name of secret if you want to use your own TLS certificate.
    # The secret must contain keys named:
    # "tls.crt" - the certificate
    # "tls.key" - the private key
    # "ca.crt" - the certificate of CA
    # These files will be generated automatically if the "secretName" is not set
    secretName: "harbar-ssl" #
    # By default, the Notary service will use the same cert and key as
    # described above. Fill the name of secret if you want to use a
    # separated one. Only needed when the type is "ingress".
    notarySecretName: "harbar-notray-ssl"
    # The common name used to generate the certificate, it's necessary
    # when the type isn't "ingress" and "secretName" is null
    commonName: ""
  ingress:
    hosts:
      core: harbor.haozi.local
      notary: notray.harbor.haozi.local
    # set to the type of ingress controller if it has specific requirements.
    # leave as `default` for most ingress controllers.
    # set to `gce` if using the GCE ingress controller
    # set to `ncp` if using the NCP (NSX-T Container Plugin) ingress controller
    controller: default
    annotations:
      ingress.kubernetes.io/ssl-redirect: "true"
      ingress.kubernetes.io/proxy-body-size: "0"
      nginx.ingress.kubernetes.io/ssl-redirect: "true"
      nginx.ingress.kubernetes.io/proxy-body-size: "0"
  clusterIP:
    # The name of ClusterIP service
    name: harbor
    ports:
      # The service port Harbor listens on when serving with HTTP
      httpPort: 80
      # The service port Harbor listens on when serving with HTTPS
      httpsPort: 443
      # The service port Notary listens on. Only needed when notary.enabled
      # is set to true
      notaryPort: 4443
  nodePort:
    # The name of NodePort service
    name: harbor
    ports:
      http:
        # The service port Harbor listens on when serving with HTTP
        port: 80
        # The node port Harbor listens on when serving with HTTP
        nodePort: 30002
      https:
        # The service port Harbor listens on when serving with HTTPS
        port: 443
        # The node port Harbor listens on when serving with HTTPS
        nodePort: 30003
      # Only needed when notary.enabled is set to true
      notary:
        # The service port Notary listens on
        port: 4443
        # The node port Notary listens on
        nodePort: 30004
  loadBalancer:
    # The name of LoadBalancer service
    name: harbor
    # Set the IP if the LoadBalancer supports assigning IP
    IP: ""
    ports:
      # The service port Harbor listens on when serving with HTTP
      httpPort: 80
      # The service port Harbor listens on when serving with HTTPS
      httpsPort: 443
      # The service port Notary listens on. Only needed when notary.enabled
      # is set to true
      notaryPort: 4443

# The external URL for Harbor core service. It is used to
# 1) populate the docker/helm commands showed on portal
# 2) populate the token service URL returned to docker/notary client
#
# Format: protocol://domain[:port]. Usually:
# 1) if "expose.type" is "ingress", the "domain" should be
# the value of "expose.ingress.hosts.core"
# 2) if "expose.type" is "clusterIP", the "domain" should be
# the value of "expose.clusterIP.name"
# 3) if "expose.type" is "nodePort", the "domain" should be
# the IP address of k8s node
#
# If Harbor is deployed behind the proxy, set it as the URL of proxy
externalURL: https://harbor.haozi.local

# The persistence is enabled by default and a default StorageClass
# is needed in the k8s cluster to provision volumes dynamicly.
# Specify another StorageClass in the "storageClass" or set "existingClaim"
# if you have already existing persistent volumes to use
#
# For storing images and charts, you can also use "azure", "gcs", "s3",
# "swift" or "oss". Set it in the "imageChartStorage" section
persistence:
  enabled: true
  # Setting it to "keep" to avoid removing PVCs during a helm delete
  # operation. Leaving it empty will delete PVCs after the chart deleted
  resourcePolicy: "keep"
  persistentVolumeClaim:
    registry:
      # Use the existing PVC which must be created manually before bound,
      # and specify the "subPath" if the PVC is shared with other components
      existingClaim: "nfs-registry-pvc"
      # Specify the "storageClass" used to provision the volume. Or the default
      # StorageClass will be used(the default).
      # Set it to "-" to disable dynamic provisioning
      storageClass: ""
      subPath: "registry"
      accessMode: ReadWriteOnce
      size: 1000Gi
    chartmuseum:
      existingClaim: "nfs-registry-pvc"
      storageClass: ""
      subPath: "chartmuseum"
      accessMode: ReadWriteOnce
      size: 200Gi
    jobservice:
      existingClaim: "nfs-registry-pvc"
      storageClass: ""
      subPath: "jobservice"
      accessMode: ReadWriteOnce
      size: 1Gi
    # If external database is used, the following settings for database will
    # be ignored
    database:
      existingClaim: "nfs-registry-pvc"
      storageClass: ""
      subPath: "database"
      accessMode: ReadWriteOnce
      size: 1Gi
    # If external Redis is used, the following settings for Redis will
    # be ignored
    redis:
      existingClaim: "nfs-registry-pvc"
      storageClass: ""
      subPath: "redis"
      accessMode: ReadWriteOnce
      size: 1Gi
  # Define which storage backend is used for registry and chartmuseum to store
  # images and charts. Refer to
  # https://github.com/docker/distribution/blob/master/docs/configuration.md#storage
  # for the detail.
  imageChartStorage:
    # Specify whether to disable `redirect` for images and chart storage, for
    # backends which not supported it (such as using minio for `s3` storage type), please disable
    # it. To disable redirects, simply set `disableredirect` to `true` instead.
    # Refer to
    # https://github.com/docker/distribution/blob/master/docs/configuration.md#redirect
    # for the detail.
    disableredirect: false
    # Specify the type of storage: "filesystem", "azure", "gcs", "s3", "swift",
    # "oss" and fill the information needed in the corresponding section. The type
    # must be "filesystem" if you want to use persistent volumes for registry
    # and chartmuseum
    type: filesystem
    filesystem:
      rootdirectory: /storage
      #maxthreads: 100
    azure:
      accountname: accountname
      accountkey: base64encodedaccountkey
      container: containername
      #realm: core.windows.net
    gcs:
      bucket: bucketname
      # The base64 encoded json file which contains the key
      encodedkey: base64-encoded-json-key-file
      #rootdirectory: /gcs/object/name/prefix
      #chunksize: "5242880"
    s3:
      region: us-west-1
      bucket: bucketname
      #accesskey: awsaccesskey
      #secretkey: awssecretkey
      #regionendpoint: http://myobjects.local
      #encrypt: false
      #keyid: mykeyid
      #secure: true
      #v4auth: true
      #chunksize: "5242880"
      #rootdirectory: /s3/object/name/prefix
      #storageclass: STANDARD
    swift:
      authurl: https://storage.myprovider.com/v3/auth
      username: username
      password: password
      container: containername
      #region: fr
      #tenant: tenantname
      #tenantid: tenantid
      #domain: domainname
      #domainid: domainid
      #trustid: trustid
      #insecureskipverify: false
      #chunksize: 5M
      #prefix:
      #secretkey: secretkey
      #accesskey: accesskey
      #authversion: 3
      #endpointtype: public
      #tempurlcontainerkey: false
      #tempurlmethods:
    oss:
      accesskeyid: accesskeyid
      accesskeysecret: accesskeysecret
      region: regionname
      bucket: bucketname
      #endpoint: endpoint
      #internal: false
      #encrypt: false
      #secure: true
      #chunksize: 10M
      #rootdirectory: rootdirectory

imagePullPolicy: IfNotPresent

logLevel: debug
# The initial password of Harbor admin. Change it from portal after launching Harbor
harborAdminPassword: "1234567890"
# The secret key used for encryption. Must be a string of 16 chars.
secretKey: "haozi-secert-key-harbor"

# If expose the service via "ingress", the Nginx will not be used
nginx:
  image:
    repository: goharbor/nginx-photon
    tag: v1.8.2
  replicas: 1
  # resources:
  #  requests:
  #    memory: 256Mi
  #    cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}

portal:
  image:
    repository: goharbor/harbor-portal
    tag: v1.8.2
  replicas: 1
# resources:
#  requests:
#    memory: 256Mi
#    cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}

core:
  image:
    repository: goharbor/harbor-core
    tag: v1.8.2
  replicas: 1
# resources:
#  requests:
#    memory: 256Mi
#    cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}
  # Secret is used when core server communicates with other components.
  # If a secret key is not specified, Helm will generate one.
  # Must be a string of 16 chars.
  secret: ""
  # Fill the name of a kubernetes secret if you want to use your own
  # TLS certificate and private key for token encryption/decryption.
  # The secret must contain keys named:
  # "tls.crt" - the certificate
  # "tls.key" - the private key
  # The default key pair will be used if it isn't set
  secretName: ""

jobservice:
  image:
    repository: goharbor/harbor-jobservice
    tag: v1.8.2
  replicas: 1
  maxJobWorkers: 10
  # The logger for jobs: "file", "database" or "stdout"
  jobLogger: file
# resources:
#   requests:
#     memory: 256Mi
#     cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}
  # Secret is used when job service communicates with other components.
  # If a secret key is not specified, Helm will generate one.
  # Must be a string of 16 chars.
  secret: ""

registry:
  registry:
    image:
      repository: goharbor/registry-photon
      tag: v2.7.1-patch-2819-v1.8.2
    # resources:
    #  requests:
    #    memory: 256Mi
    #    cpu: 100m
  controller:
    image:
      repository: goharbor/harbor-registryctl
      tag: v1.8.2
    # resources:
    #  requests:
    #    memory: 256Mi
    #    cpu: 100m
  replicas: 1
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}
  # Secret is used to secure the upload state from client
  # and registry storage backend.
  # See: https://github.com/docker/distribution/blob/master/docs/configuration.md#http
  # If a secret key is not specified, Helm will generate one.
  # Must be a string of 16 chars.
  secret: ""

chartmuseum:
  enabled: true
  image:
    repository: goharbor/chartmuseum-photon
    tag: v0.9.0-v1.8.2
  replicas: 1
  # resources:
  #  requests:
  #    memory: 256Mi
  #    cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}

clair:
  enabled: true
  image:
    repository: goharbor/clair-photon
    tag: v2.0.8-v1.8.2
  replicas: 1
  # The http(s) proxy used to update vulnerabilities database from internet
  httpProxy:
  httpsProxy:
  # The interval of clair updaters, the unit is hour, set to 0 to
  # disable the updaters
  updatersInterval: 12
  # resources:
  #  requests:
  #    memory: 256Mi
  #    cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}

notary:
  enabled: true
  server:
    image:
      repository: goharbor/notary-server-photon
      tag: v0.6.1-v1.8.2
    replicas: 1
    # resources:
    #  requests:
    #    memory: 256Mi
    #    cpu: 100m
  signer:
    image:
      repository: goharbor/notary-signer-photon
      tag: v0.6.1-v1.8.2
    replicas: 1
    # resources:
    #  requests:
    #    memory: 256Mi
    #    cpu: 100m
  nodeSelector: {}
  tolerations: []
  affinity: {}
  ## Additional deployment annotations
  podAnnotations: {}
  # Fill the name of a kubernetes secret if you want to use your own
  # TLS certificate authority, certificate and private key for notary
  # communications.
  # The secret must contain keys named tls.ca, tls.crt and tls.key that
  # contain the CA, certificate and private key.
  # They will be generated if not set.
  secretName: ""

database:
  # if external database is used, set "type" to "external"
  # and fill the connection informations in "external" section
  type: internal
  internal:
    image:
      repository: goharbor/harbor-db
      tag: v1.8.2
    # The initial superuser password for internal database
    password: "changeit"
    # resources:
    #  requests:
    #    memory: 256Mi
    #    cpu: 100m
    nodeSelector: {}
    tolerations: []
    affinity: {}
  external:
    host: "192.168.0.1"
    port: "5432"
    username: "user"
    password: "password"
    coreDatabase: "registry"
    clairDatabase: "clair"
    notaryServerDatabase: "notary_server"
    notarySignerDatabase: "notary_signer"
    sslmode: "disable"
  ## Additional deployment annotations
  podAnnotations: {}

redis:
  # if external Redis is used, set "type" to "external"
  # and fill the connection informations in "external" section
  type: internal
  internal:
    image:
      repository: goharbor/redis-photon
      tag: v1.8.2
    # resources:
    #  requests:
    #    memory: 256Mi
    #    cpu: 100m
    nodeSelector: {}
    tolerations: []
    affinity: {}
  external:
    host: "192.168.0.2"
    port: "6379"
    # The "coreDatabaseIndex" must be "0" as the library Harbor
    # used doesn't support configuring it
    coreDatabaseIndex: "0"
    jobserviceDatabaseIndex: "1"
    registryDatabaseIndex: "2"
    chartmuseumDatabaseIndex: "3"
    password: ""
  ## Additional deployment annotations
  podAnnotations: {}
```





编辑好以后执行 , 这个命令可以让 helm 根据模板生成编排yaml, 可以很方便的修改和部署

```
helm template --name harbor . --namespace kube-ops | sed "w harbor.yaml"
```



### 安装harbor

```
kubectl apply -f harbor.yaml -n kube-ops
```

### 卸载harbor

```
kubectl delete -f harbor.yaml -n kube-ops
```

{% asset_img harbor_home.png 主页截图%}



使用 `admin`的账号, 和你设置的密码( 默认为`Harbor12345`) 即可进入