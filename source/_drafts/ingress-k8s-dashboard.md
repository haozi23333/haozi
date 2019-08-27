---
title: ingress-k8s-dashboard
date: 2019-08-27 10:32:51
tags:
---

# ingress-k8s-dashboard

安装 k8s 的官方控制台, 执行

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

会在本地打开一个端口, 但是只能在这个命令运行的时候访问,这就很麻烦, 执行, 可以看到dashboard在集群内部, 外部是无法访问的

```
kubectl -n kubernetes-dashboard get svc
```

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

找到 spec->type, 修改为 `NodePort`, wq 退出, 再执行`kubectl -n kubernetes-dashboard get svc`

```
[root@localhost ~]# kubectl -n kubernetes-dashboard get svc
NAME                        TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)         AGE
dashboard-metrics-scraper   ClusterIP   10.102.149.239   <none>        8000/TCP        11m
kubernetes-dashboard        NodePort    10.98.227.207    <none>        443:30522/TCP   11m
```

可以看到 kubernetes-dashboard  的 type已经修改为 NodePort, 分配的随机端口为 30522, 使用 MasterIP:30522 就可以访问了, 不过这个时候用 Chrome 打开的时候提示证书无效, 