---
slug: 2019/08/27/k8s-dashboard
title: 安装 k8s-dashboard
authors: haozi
tags: [k8s, 笔记]
date: 2019-08-27 10:32:51
---

# 安装 k8s-dashboard

这里是手动部署的过程~



<!--truncate-->

## 安装 k8s 的官方控制台

 执行

```sh
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta1/aio/deploy/recommended.yaml
```

完成之后执行 `kubectl get pods --namespace kubernetes-dashboard` 查看 dashboard 运行状态

```sh
[root@localhost ~]# kubectl get pods --namespace kubernetes-dashboard
NAME                                          READY   STATUS    RESTARTS   AGE
kubernetes-dashboard-5c8f9556c4-z5xm2         1/1     Running   0          97s
kubernetes-metrics-scraper-86456cdd8f-pvmjw   1/1     Running   0          97s
```

Running 说明已经正在运行中了, 但是如何访问呢?

执行

```
kubectl proxy
```

会在本地打开一个端口, 但是只能在这个命令运行的时候访问,这就很麻烦,

```
kubectl -n kubernetes-dashboard get svc
```
 执行, 可以看到dashboard在集群内部, 外部是无法访问的
```sh
[root@localhost ~]# kubectl -n kubernetes-dashboard get svc
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
dashboard-metrics-scraper   ClusterIP   10.102.149.239   <none>        8000/TCP   8m20s
kubernetes-dashboard        ClusterIP   10.98.227.207    <none>        443/TCP    8m20s
```
执行命令, 编辑这个容器的网络svc 配置
```
kubectl -n kubernetes-dashboard edit svc kubernetes-dashboard
```

```yaml
# Please edit the object below. Lines beginning with a '#' will be ignored,
# and an empty file will abort the edit. If an error occurs while saving this file will be
# reopened with the relevant failures.
#
apiVersion: v1
kind: Service
metadata:
  annotations:
    kubectl.kubernetes.io/last-applied-configuration: |
      {"apiVersion":"v1","kind":"Service","metadata":{"annotations":{},"labels":{"k8s-app":"kubernetes-dashboard"},"name":"kubernetes-dashboard","namespace":"kubernetes-dashboard"},"spec":{"ports":[{"port":443,"targetPort":8443}],"selector":{"k8s-app":"kubernetes-dashboard"}}}
  creationTimestamp: "2019-08-26T13:35:07Z"
  labels:
    k8s-app: kubernetes-dashboard
  name: kubernetes-dashboard
  namespace: kubernetes-dashboard
  resourceVersion: "1201"
  selfLink: /api/v1/namespaces/kubernetes-dashboard/services/kubernetes-dashboard
  uid: 21c79b9d-0767-4c98-af3f-493d6749ba3b
spec:
  clusterIP: 10.98.227.207
  ports:
  - port: 443
    protocol: TCP
    targetPort: 8443
  selector:
    k8s-app: kubernetes-dashboard
  sessionAffinity: None
  type: ClusterIP     # 这里修改为 NodePort
status: 
  loadBalancer: {}
```

找到 spec->type, 修改为 `NodePort`, `:wq` 退出, 再执行`kubectl -n kubernetes-dashboard get svc`

```
[root@localhost ~]# kubectl -n kubernetes-dashboard get svc
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
dashboard-metrics-scraper   ClusterIP   10.102.149.239   <none>        8000/TCP        11m
kubernetes-dashboard        NodePort    10.98.227.207    <none>        443:30522/TCP   11m
```

可以看到 kubernetes-dashboard  的 type已经修改为 NodePort, 分配的随机端口为 30522, 使用 MasterIP:30522 就可以访问了, 不过这个时候用 Chrome 打开的时候提示证书无效, 

![错误https](./k8s-dashboard/error_cert.png)

虽然这个错误可以通过一定的方式忽略, 但是我们尝试解决一下,给他分配一个正确的 ssl 证书了



### 获取 SSL 证书

参考 [自建CA并签发证书](./自建CA并签发证书.md)  一文签发有效的 SSL 证书, 或者使用其他服务签发有效的 SSL 证书



## 应用证书


删除旧的 dashboard Pod
> 这里的 url 就是上面部署用的, 你个可以直接 wget 下来避免出问题
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta1/aio/deploy/recommended.yaml
```



<div style={{display:"none"}}>
  运行 `kubectl get secret -n kubernetes-dashboard`, 查看 `kubernetes-dashboard-certs `是否存在, 如果存在的话, 先删除

```sh
~/ca/k8s-dashboard.haozi.local at ☸️  kubernetes-admin@kubernetes
➜ kubectl get secret -n kubernetes-dashboard
NAME                               TYPE                                  DATA   AGE
default-token-4h5q8                kubernetes.io/service-account-token   3      2d19h
kubernetes-dashboard-certs         Opaque                                0      2d19h
kubernetes-dashboard-csrf          Opaque                                1      2d19h
kubernetes-dashboard-key-holder    Opaque                                2      2d19h
kubernetes-dashboard-token-gljs5   kubernetes.io/service-account-token   3      2d19h
```

这里已经有了, 执行`kubectl delete secret kubernetes-dashboard-certs -n kubernetes-dashboard` 删除原来的

```sh
~/ca/k8s-dashboard.haozi.local at ☸️  kubernetes-admin@kubernetes
➜ kubectl delete secret kubernetes-dashboard-certs -n kubernetes-dashboard
secret "kubernetes-dashboard-certs" deleted
```
</div>



使用官网的 yml 创建 dashboard 的时候 namespace 为 `kubernetes-dashboard`, 刚刚我们删除了, 先重建一个 `kubectl create namespace kubernetes-dashboard`

```
~/ca/k8s-dashboard.haozi.local at ☸️  kubernetes-admin@kubernetes
➜ kubectl create namespace kubernetes-dashboard
namespace/kubernetes-dashboard created
```



创建 k8s `secret`,  `/usercert.pem` 和 `./key.pem`就分别是申请好的证书和证书的 Key

```
kubectl create secret generic kubernetes-dashboard-certs --from-file=dashboard.crt=./usercert.pem --from-file=dashboard.key=./key.pem  -n kubernetes-dashboard
```

```
~/ca/k8s-dashboard.haozi.local at ☸️  kubernetes-admin@kubernetes
➜ kubectl create secret generic kubernetes-dashboard-certs --from-file=dashboard.crt=./usercert.pem --from-file=dashboard.key=./key.pem  -n kubernetes-dashboard
secret/kubernetes-dashboard-certs created
```

再运行安装第一步的安装命令进行安装, 再修改 `NodePort`为 `NodePort` 这里就可以正常访问了

![安装完成截图](./k8s-dashboard/dashboard_installed.png)





## 登录

### Token

可以参考 [kubernetes-Authenticating](https://kubernetes.io/docs/reference/access-authn-authz/authentication/) 以及 [Creating sample user](https://github.com/kubernetes/dashboard/wiki/Creating-sample-user) 创建有权限控制的用户, 这里应为是内网就比较懒了

![GIF](./k8s-dashboard/sticker.gif)



#### 创建管理员

在  `kube-system` 里面创建一个 `admin-user`

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kube-system
```

#### 创建角色绑定

使用 `kubeadm`创建的 k8s 集群,`ClusterRole`,`admin-Role`已经存在, 只需要创建 `ClusterRoleBinding`和`ServiceAccount`的绑定

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kube-system
```

分别执行上面的两个 yml ,  `kubectl apple -f xxxx.yml`

#### 获取 token

执行这个

```sh
kubectl -n kube-system describe secret $(kubectl -n kube-system get secret | grep admin-user | awk '{print $1}')
```

复制下面的 token 到 dashboard 的 token 登录

```sh
Name:         admin-user-token-h6cnn
Namespace:    kube-system
Labels:       <none>
Annotations:  kubernetes.io/service-account.name: admin-user
              kubernetes.io/service-account.uid: f4c8f8ea-bba9-498d-9ab6-8ad3ec27a465

Type:  kubernetes.io/service-account-token

Data
====
ca.crt:     1025 bytes
namespace:  11 bytes
token:      eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrdWJlLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJhZG1pbi11c2VyLXRva2VuLWg2Y25uIiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9zZXJ2aWNlLWFjY1bnQubmFtZSI6ImFkbWluLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJmNGM4ZjhlYS1iYmE5LTQ5OGQtOWFiNi04YWQzZWMyN2E0NjUiLCJzdWIiOiJzeXN0Z2VydmljZWFjY291bnQ6a3ViZS1zeXN0ZW06YWRtaW4tdXNlciJ9.OTi_rSXKT_d4V3NCPMi7tTuAyuzn9qlsX7lSz7sLNplNbUgezp39eotnhMM4k34KA2CkVj5UKyqwg8BMlouBk1jUYJfo5IuCJPoHvG11iHSTclJFrzJhYB_lZsoKplofSfhyzhzIXzEv2F4M5OF-lDuZGAvkMdwDXcdYiabf57VOELzjNa_e5_xbBrFCGyM7P5RrbULG4QpiLambW0cS1BuaGnT0C5lDIY5Hx9NxFJ7U-j9td_5ZhcAAe8sqmg7pKTQHFTgf-7796fgQGR7tw77z9kZY5t3Ut6_qp5VjTSCVSjPbmthD1JpEyQCqygH7fmAjIuQc7Qw3Dl0bSL9MTw
```



### Kubeconfg 

这个比较简单, 直接把 kubectl 的 config 拷贝出来, 将上面生成的 token放置在 `users -> user-> token`

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0...省略
    server: https://192.168.50.160:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    token: eyJhbGciOiJSUzI1NiIsImtpZCI6IiJ9.eyJpc...省略 # 放置在此
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FU...省略
    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJ...省略
```



然后在登录页面上传本配置即可

![dashboard主页](./k8s-dashboard/k8s_dashboard_home.png)

