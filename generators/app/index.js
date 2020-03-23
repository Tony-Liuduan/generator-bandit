const Generator = require('yeoman-generator');
require('colors'); // https://www.npmjs.com/package/colors


console.log('hello bandit'.yellow); // outputs green text


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
        // 此async是 run-async 包提供的能力，fn.bind({async() {}}, arguments)
        // 如此可将生命周期的执行由异步变为同步的顺序执行
        let done = this.async();
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
                default: 'React',
                when: answer => answer.name !== '', // 表示上一条输入的答案符合条件才执行
                validate: function (input, answer) {    // 校验逻辑
                    // ...
                    return true;
                }
            }
        ];
        this.prompt(prompts)
            .then(answers => {
                this.name = answers.name;
                this.framework = answers.framework;
                console.log(answers);

                // 相对于执行了 Promise.resolve(), 可以调用then执行下一个生命周期勾子
                done();

                // 如果需要在此执行子文件命令，可写如下代码，相当于执行 yo bandit:React, 即跳转执行./generators/React/index.js
                // this.composeWith('bandit:' + answers.framework)
            })
    }

    writing() {
        // copyTpl方法在this.fs下且默认使用ejs语法,
        this.fs.copyTpl(
            this.templatePath(), // 参数1：模板路径
            this.destinationPath(this.name), // 参数2：输出文件路径
            {   // 参数3：模板变量
                name: this.name,
                framework: this.framework,
            }
        );
    }
};