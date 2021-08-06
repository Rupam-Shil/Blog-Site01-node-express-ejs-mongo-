const express = require('express');
const articles = require('./routes/articles');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');
const app = express();

mongoose.connect('mongodb://localhost/markdownblog', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

mongoose.connection.once('open', () => {
	console.log('connected');
});

app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

app.use('/articles', articles);

app.get('/', async (req, res) => {
	const articles = await Article.find({}).sort({
		createdAt: 'desc',
	});
	res.render('articles/index', { articles: articles });
});

app.listen(5000);
