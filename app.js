const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('CAnnot cannot to data base', err.message));

    const authorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    author: authorSchema
}));

async function createAuthor (name, bio, website) {
    const author = new Author({
        name,
        bio,
        website
    });

    const result = await author.save();
    console.log(result);
}
async function createCourse (name, author) {
    const course = new Course({
        name,
        author
    });

    const result = await course.save();
    console.log(result);
}

async function listCoure() {
    const course = await Course.find()
        .select('name')
        

    console.log(course);
}

createCourse('NodeJs', new Author({ name: 'Mosh', bio: 'Jami', website: 'myweb'}));

// listCoure();