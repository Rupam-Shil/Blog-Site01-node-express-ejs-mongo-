const mongoose = require('mongoose');
const { Schema } = mongoose;
const marked = require('marked');
const slugify = require('slugify');
const createDomPurifier = require('dompurify');
const { JSDOM } = require('jsdom');
const domPurify = createDomPurifier(new JSDOM().window);

const articleSchema = new Schema({
	title: String,
	description: String,
	markdown: String,
	createdAt: {
		type: Date,
		default: Date.now,
	},
	slug: {
		type: String,
		required: true,
		unique: true,
	},
	sanitizedHTML: {
		type: String,
		required: true,
	},
});

articleSchema.pre('validate', function (next) {
	if (this.title) {
		this.slug = slugify(this.title, { lower: true, strict: true });
	}
	if (this.markdown) {
		let html = marked(this.markdown);
		this.sanitizedHTML = domPurify.sanitize(html);
	}
	next();
});

const Article = mongoose.model('articles', articleSchema);
module.exports = Article;
