const fs = require('fs')
const _ = require('lodash')

const __schema = process.argv[2].toLowerCase()
const __name = process.argv[3]

const __nameInSnakeCase = _.snakeCase(__name)
const __nameInKebabCase = _.kebabCase(__name)
const __nameInCamelCase = _.camelCase(__name)

let __src = './src/app/main-module'
let __extendBase = false
let __entities
let __hasRecycleBin = false
let __fields = []

process.argv.forEach(arg => {
    if (arg.startsWith('--src')) {
        __src = arg.split('=')[1]
    } else if (arg.startsWith('--extend-base')) {
        __extendBase = true
    } else if (arg.startsWith('--junction-model') || arg.startsWith('associative-entity')) {
        __entities = arg.split('=')[1].split(",")
    } else if (arg.startsWith('--has-recycle-bin')) {
        __hasRecycleBin = true
    } else if (arg.startsWith('--fields')) {
        __fields = arg.split('=')[1].split(",")
    }
})

if (__schema === 'all') {
    genEntity()
    genService()
    genController()
} else if (__schema === 'entity') {
    genEntity()
} else if (__schema === 'service') {
    genService()
} else if (__schema === 'component') {
    genController()
}

function genEntity() {
    fs.mkdirSync(`${__src}/domain/${__nameInKebabCase}`, { recursive: true })

    let __filePath = `${__src}/domain/${__nameInKebabCase}/${__nameInKebabCase}.domain.ts`
    let rs = fs.existsSync(__filePath)
    if (rs) {
        console.log(`err: file '${__filePath}' existed`)
        return
    }

    console.log(`=============== gen entity ===============`)
    let __templatePath = './src/app/common-module/.template/entity.temp'
    if (__extendBase) {
        __templatePath = './src/app/common/.template/entity-extend-base.temp'
    }
    let __content = fs.readFileSync(__templatePath)?.toString()
    __content = __replaceDefault(__content)
    __content = __addTableColumns(__content)

    console.log(__content)
    console.log(`=============== gen entity ===============`)
    fs.writeFileSync(__filePath, __content, { encoding: 'utf8', flag: 'w' })
}

function genController() {
    fs.mkdirSync(`${__src}/components/${__nameInKebabCase}`, { recursive: true })

    let __filePath = `${__src}/components/${__nameInKebabCase}/${__nameInKebabCase}.component.ts`
    let rs = fs.existsSync(__filePath)
    if (rs) {
        console.log(`err: file '${__filePath}' existed`)
        return
    } else {
        console.log(`=============== gen controller ===============`)
        let __content = fs.readFileSync('./src/app/common-module/.template/controller.temp')?.toString()
        __content = __replaceDefault(__content)
        console.log(__content)
        console.log(`=============== gen controller ===============`)
        fs.writeFileSync(__filePath, __content, { encoding: 'utf8', flag: 'w' })
        fs.writeFileSync(`${__src}/components/${__nameInKebabCase}/${__nameInKebabCase}.component.css`, '', { encoding: 'utf8', flag: 'w' })
    }
}

function genService() {
    fs.mkdirSync(`${__src}/services/${__nameInKebabCase}`, { recursive: true })

    let __filePath = `${__src}/services/${__nameInKebabCase}/${__nameInKebabCase}.service.ts`
    let rs = fs.existsSync(__filePath)
    if (rs) {
        console.log(`err: file '${__filePath}' existed`)
        return
    }

    console.log(`=============== gen service ===============`)
    let __content = fs.readFileSync('./src/app/common-module/.template/service.temp')?.toString()
    __content = __replaceDefault(__content)
    console.log(__content)
    console.log(`=============== gen service ===============`)
    fs.writeFileSync(__filePath, __content, { encoding: 'utf8', flag: 'w' })
}

function __replaceDefault(content) {
    content = content.replaceAll(/@@name@@/g, __name)
    content = content.replaceAll(/@@nameInCamelCase@@/g, __nameInCamelCase)
    content = content.replaceAll(/@@nameInKebabCase@@/g, __nameInKebabCase)
    content = content.replaceAll(/@@nameInSnakeCase@@/g, __nameInSnakeCase)
    return content
}

function __addTableColumns(__content) {
    let __tableColumns = []
    let __match = __content.match(/TableColumn\[\] = (\[[\s\S]*\])/)
    eval(`__tableColumns = ${__match[1]}`)

    if (__fields.length > 0) {
        __fields.forEach((field) => {
            let __field = __tableColumns.find((item) => {
                return item.code === field
            })
            if (__field) return

            __tableColumns.push({
                code: field, name: field, headerStyle: "text-align: center;", dataStyle: "text-align: center;",
                filter: true, filterType: 'text', matchMode: 'contains'
            })
        })

        __content = __content.replace(/TableColumn\[\] = (\[[\s\S]*\])/, `TableColumn[] = ${JSON.stringify(__tableColumns, null, 2)}`)
    }

    return __content
}

function __addFormFields(__content) {
    let __formFields = []
    let __match = __content.match(/FormField\[\] = (\[[\s\S]*\])/)
    eval(`__formFields = ${__match[1]}`)

    if (__fields.length > 0) {
        __fields.forEach((field) => {
            let __field = __formFields.find((item) => {
                return item.code === field
            })
            if (__field) return

            __formFields.push({
                code: field, name: field, span: 24, type: 'text', placeholder: `Enter ${field}`,
                required: true,
                onEvent: (sender, event) => { this.onEvent(sender, event); }
            })
        })

        __content = __content.replace(/FormField\[\] = (\[[\s\S]*\])/, `FormField[] = ${JSON.stringify(__tableColumns, null, 2)}`)
    }

    return __content
}