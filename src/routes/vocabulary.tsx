import VocabularyBook from '../pages/vocabulary-book/index'
const vocabularyBookPage = {
    path: '/vacabulary-book/:type?',
    element: <VocabularyBook />,
    index: true,
    name: '单词本',
    meta: {
        title: "单词本"
    }
}

export default vocabularyBookPage