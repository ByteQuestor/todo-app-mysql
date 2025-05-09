# 运行步骤

1，在`front`和`backend`里面同时运行

```shell
npm install
```

2，为后端添加环境变量

```tex
DB_URL="mysql://root:000000@localhost:3306/wzy_todoapp"
```

3，运行命令

+ `front`

  ```shell
  npm run start
  ```

+ `bacnend`

  ```shell
  npm run start:env
  ```

  