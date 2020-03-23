# CLI
> 本文内容来源：https://www.jianshu.com/p/93211004c5ac

## 运行本项目

```sh
npm i -g yo
npm i
npm link
yo bandit
```


#### 如需删除本地link链接
```
npm unlink
```

---


## 创建本地命令
> 当我们的cli并没有发布到npm时，可以借助npm link选择本地安装，这样就可以在本地执行cli命令了

1. 配置`package.json`
```json
{
    "bin": {
        "yourcli": "src/index.js"
    }
}
```
2. 创建入口文件`src/index.js`
> 强调：入口js文件第一行必须是`#!/usr/bin/env node`，用来指明运行环境

```js
#!/usr/bin/env node

// 获取命令参数
const argv = require('yargs-parser')(process.argv.slice(2));

console.log(argv);
```

在写npm包的时候需要在脚本的第一行写上`#!/usr/bin/env node`，用于指明该脚本文件要使用node来执行。

`/usr/bin/env` 用来告诉用户到path目录下去寻找node，`#!/usr/bin/env node` 可以让系统动态的去查找node，已解决不同机器不同用户设置不一致问题。

PS：该命令必须放在第一行， 否者不会生效

3. 借助npm link选择本地安装，执行：
```sh
npm link
```

4. 验证，执行：
```sh
yourcli -h=1 -v=1

## 输出：{ _: [], h: 1, v: 1 }
```

--- 

## 控制台交互
> 有的时候我们可能需要在命令行工具中融入一些交互，根据用户的输入生成一些东西或者做相应的操作

1. 装包，执行：
```sh
npm i inquirer
```
inquirer 这个包基本包含了我们可能用到的交互类型，例如input、list、confirm等，可以轻松地帮我们实现控制台的简单交互


2. inquirer-[example](https://github.com/SBoudrias/Inquirer.js/tree/master/packages/inquirer/examples)


---

## yeoman create generator
> yeoman 是一个可以帮助我们生成任何类型 app 的脚手架工具，这一功能依赖于 yeoman 的各种 generators。每一个 generator 都是 yeoman 封装好的一个个 npm package，我们可以引用已经发布的 generators ，也可以自定义一个 generator。

1. 安装yo，执行：
```sh
npm install -g yo
```
2. 创建脚手架generator规则：
    * 文件夹必须命名为 generator-[generator name] 的形式
    * 项目中须有 package.json 文件，且属性值须满足下列要求：
        - name 属性值须是 "generator-name"
        - keywords 属性值必须为 "yeoman-generator"
        - files 属性值须为数组且包含所有 "generator" 的目录

3. 创建package.json && 安装依赖
```json
{
  "name": "generator-yourcliname",
  "version": "1.0.0",
  "description": "",
  "main": "generators/app/index.js",
  "files": [
    "generators"
  ],
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "yeoman-generator"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "inquirer": "^7.1.0",
    "yargs-parser": "^18.1.1",
    "yeoman-generator": "^4.7.2"
  }
}
```

4. 目录结构
> 详见：https://www.jianshu.com/p/93211004c5ac
yeoman 支持如下两种定义目录结构的方式：
```json
// 方式1
{
    "files": [
        "generators"
    ],
}
```
```json
// 方式2
{
  "files": [
    "app",
    "router"
  ]
}
```
如果使用的是第二种方式，需要在package.json中显式声明


5. test，执行：
```sh
## 需要注意的是，因为我们的示例代码是在本地开发，并未发布到npm上，因此yeoman是无法识别我们的generator的，因此需要执行npm link将其链接到本地
## 这里app/index.js 无需执行运行环境，yo已经帮忙做了
npm link

yo bandit
```

## yo - Run Loop
> 对于我们自定义的方法，yeoman将按照队列顺序依次执行，同时yeoman也内置了一些的预先定义好执行顺序的方法供我们使用（类似生命周期方法）

1. initializing -- 初始化方法（检查状态、获取配置等）
2. prompting -- 获取用户交互数据（this.prompt()）
3. configuring -- 编辑和配置项目的配置文件
4. default -- 如果generator内部还有不符合任意一个任务队列任务名的方法，将会被放在default这个任务下进行运行
5. writing -- 填充预置模板
6. conflicts -- 处理冲突（仅限内部使用）
7. install -- 进行依赖的安装（eg：npm，bower）
8. end -- 最后调用，做一些clean工作


## yo - 交互
> prompts是yeoman实现交互的主要方式，即上一部分提到的prompting，它是基于inquirer.js实现

```js
// 基于 in
const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  // add your own methods
  prompting() {
    // prompt是一个异步方法，因此在获取交互数据的时候需要做同步处理，否则直接执行到 writing 生命周期，不符合预期
    // 此async是 run-async 包提供的能力，fn.bind({async() {}}, arguments)
    // 如此可将生命周期的执行由异步变为同步的顺序执行
    const done = this.async();
    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: 'test-project'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'choose a framework',
        choices: ['React', 'Vue', 'Angular'],
        default: 'React'
      }
    ];

    this.prompt(prompts).then(answers => {
      this.name = answers.name;
      this.framework = answers.framework;
      // 相对于执行了 Promise.resolve(), 可以调用then执行下一个生命周期勾子
      done();
    })
  }
};
```


## yo - 根据模板生成脚手架

1. 这一步本质上是文件的拷贝，所以需要考虑的有三个问题：
    * 如何读取源文件地址（模板）
    * 如何读取目标地址
    * 如何完成拷贝操作
```js
class extends Generator {
    path() {
      // 目标目录即我们要生成脚手架的目录
      this.destinationRoot();
      // returns '~/projects'
      this.destinationPath('index.js');
      // returns '~/projects/index.js'
      
      
      // 模板路径顾名思义就是模板存放的路径，默认存在当前路径下的templates目录，可以调用this.sourceRoot()来获取，也可以指定路径
      this.sourceRoot();
      // returns './templates'
      this.templatePath('index.js');
      // returns './templates/index.js'
    }

    // 拷贝文件 this.fs.copyTpl
    writing() {
      this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(this.name) // this.name 是用户输入的
    );
  }
}
```


## yo - 异步转同步顺序执行
yeoman-generator 内部使用了 run-async 这个库，想了解这个库，可以看 `./useRunAsync.js` demo