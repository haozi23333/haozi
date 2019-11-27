FROM codercom/code-server

SHELL ["/bin/bash", "-c"]
RUN sudo apt-get update && \
  sudo apt-get install -y htop
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash && \
  . ~/.nvm/nvm.sh \
  && nvm install node

LABEL project_root " ~/Projects/haozi23333"