# visualization

## Client

[vitesse-lite](https://github.com/antfu/vitesse-lite)

```bash
$ cd client

# Install Dependencies
$ pnpm i # If you don't have pnpm installed, run: npm install -g pnpm

# Compiles for development
$ pnpm run dev
```

## Server

```bash
$ cd server

# Creating a Virtual Environment
$ python3 -m venv .venv

#Activating the virtual environment
$ . .venv/bin/activate

# Install Dependencies
$ pip3 install -r requirements.txt

# Run
$ python run.py
```

## 需要改的部分
不需要前后端联动的情况下server不需要动（建议数据处理复杂的部分在python中处理好直接以json文件形式import，简单的部分使用js处理）

只需要改动client/src文件夹，assets文件夹存放json数据，components文件夹下是vue格式的各个组件，单个vue文件包括js html css（可省略）三部分，已有的html文件转换为vue文件比较方便，可以参考示例两个文件中如何调用和改变状态管理库的状态

pages文件夹下的index.vue控制各个组件在页面中的显示，调试代码的时候可用

stores文件夹下的data.ts文件管理整个系统的状态，ts文件相较js文件对数据格式要求更加严格，部分语句会标红，控制台不报错就可忽略

单个组件中需要和其他组件同步的状态变量（比如时间）放在data.ts中，其他变量在本文件内处理就可以，函数同理

```
export const useDataStore = defineStore({
  id: 'data',
  state: () => {
    return {"这里添加公用变量"}
```
