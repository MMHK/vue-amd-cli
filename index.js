#!/usr/bin/env node

var fs = require('fs')
var process = require('process')
var prompt = require('prompt')
var colors = require('colors/safe')
var path = require('path')
var template = require('lodash.template')
var git_download = require('download-git-repo')
var bower = require('bower')

require.extensions['.tpl'] = function (module, filename) {
  var tmp = ''
  try {
    tmp = fs.readFileSync(filename, 'utf8')
  } catch (e) {
    console.error(e)
  }
  module.exports = tmp
}

var ROOT_DIR = process.cwd(),
  TEMPLATE = {
    html: require('./template/html.tpl'),
    css: require('./template/css.tpl'),
    service: template(require('./template/service.tpl')),
    js: template(require('./template/js.tpl'))
  }

prompt.message = colors.green('vue-amd-cli')
prompt.delimiter = colors.green('#')

if (fs.existsSync(path.join(ROOT_DIR, 'package.json'))) {
  //
  // Start the prompt
  //
  prompt.start()

  init()
} else {
  install()
}

function install() {
  prompt.get({
    properties: {
      project_name: {
        description: colors.green('\n 请输入项目名')
      }
    }
  }, function (err, result) {
    if (err) {
      console.log(err)
    }
    git_download('MMHK/vue-amd-template', '.', {
      clone: false
    }, function (err) {
      if (err) {
        console.error(err)
        return
      }
      replaceFile(path.join(ROOT_DIR, 'readme.md.tpl'), {
        'project_name': result.project_name
      })
      replaceFile(path.join(ROOT_DIR, 'package.json.tpl'), {
        'project_name': result.project_name
      })
      replaceFile(path.join(ROOT_DIR, 'index.html.tpl'), {
        'project_name': result.project_name
      })
      replaceFile(path.join(ROOT_DIR, 'bower.json.tpl'), {
        'project_name': result.project_name
      })

      bower.commands
        .install([], {
          production: true,
          save: false
        }, {
          interactive: true
        })
        .on("log", function (args) {
          if (args.level == "action" && args.id == "install") {
            console.log("%s...安装中...", args.message);
          }
        })
        .on('end', function (installed) {
          console.log("安装成功！")
        })
    })
  })

  prompt.start()
}

function init() {
  prompt.get({
    properties: {
      type: {
        description: colors.green('\n 请选择功能: \n 1: 新建组件; \n 2: 新建页面; \n 3: 新建服务 \n')
      },
      name: {
        description: colors.green('\n 请输入新的模块名: \n')
      }
    }
  }, function (err, result) {
    if (result.type == 1) {
      component(result.name)
      return
    }
    if (result.type == 3) {
      service(result.name)
      return
    } else {
      page(result.name)
      return
    }
  })
}

function saveFile(filename, content) {
  var dir = path.dirname(filename)
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
    fs.writeFileSync(filename, content)
  } catch (e) {
    console.error(e)
  }
}

function replaceFile(template_name, args) {
  try {
    var file = fs.readFileSync(template_name, 'utf8'),
      distFile = template_name.replace('.tpl', ''),
      temp = template(file)(args)
    saveFile(distFile, temp)
    fs.unlinkSync(template_name)
  } catch (e) {
    console.error(e)
  }
}

function page(name) {
  var fullpath = 'page/' + name

  if (fs.existsSync(path.join(ROOT_DIR, fullpath + '.js'))) {
    console.log(colors.red('已经存在page:' + fullpath))
    return
  }

  saveFile(path.join(ROOT_DIR, fullpath + '.js'), TEMPLATE.js({
    filebase: fullpath
  }))
  saveFile(path.join(ROOT_DIR, fullpath + '.css'), TEMPLATE.css)
  saveFile(path.join(ROOT_DIR, fullpath + '.html'), TEMPLATE.html)

  console.log(colors.green('创建page:' + fullpath + ' 成功！'))
}

function component(name) {
  var fullpath = 'component/' + name

  if (fs.existsSync(path.join(ROOT_DIR, fullpath + '.js'))) {
    console.log(colors.red('已经存在 component:' + fullpath))
    return
  }

  saveFile(path.join(ROOT_DIR, fullpath + '.js'), TEMPLATE.js({
    filebase: fullpath
  }))
  saveFile(path.join(ROOT_DIR, fullpath + '.css'), TEMPLATE.css)
  saveFile(path.join(ROOT_DIR, fullpath + '.html'), TEMPLATE.html)

  console.log(colors.green('创建 component:' + fullpath + ' 成功！'))
}

function service(name) {
  var fullpath = 'service/' + name

  if (fs.existsSync(path.join(ROOT_DIR, fullpath + '.js'))) {
    console.log(colors.red('已经存在 service:' + fullpath))
    return
  }

  saveFile(path.join(ROOT_DIR, fullpath + '.js'), TEMPLATE.service({
    filebase: fullpath
  }))
}