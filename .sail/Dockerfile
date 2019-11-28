# 从比较基本的 Ubuntu-docker 开始, 目前比较新, 否则需要自己拉 sail 的代码从头构建
FROM codercom/ubuntu-docker


# 这部分是 Ubuntu-dev 的构建代码, 由于太久么更新了, 就复制过来了
LABEL share.ssh="~/.ssh:~/.ssh"

RUN adduser --gecos '' --disabled-password user && \
    echo "user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/nopasswd

# 这里切换到 root , code-server 这个可能会没有权限读写 /home/user, 
USER root

RUN mkdir -p ~/.vscode/extensions

# 安装 Node 13 的依赖
CMD ["/bin/bash", "-c"]
RUN sudo apt-get update && \
  sudo apt-get install -y htop
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash && \
  . ~/.nvm/nvm.sh \
  && nvm install node

# 全局安装 hexo
RUN npm i -g hexo