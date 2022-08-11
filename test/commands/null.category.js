const { join } = require('path')
const { Category } = require('../../dist')

module.exports = class extends Category {
	name = null
	importIn = join(__dirname, './no-category')
}
