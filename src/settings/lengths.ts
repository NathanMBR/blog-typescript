// Lengths
const usersLengths = {
    name: {
        min: 3,
        max: 20
    },

    email: {
        min: 3,
        max: 50
    },

    password: {
        min: 8,
        max: 512
    },
    
    profilePicture: {
        min: 1,
        max: 512
    }
}

const categoriesLengths = {
    category: {
        min: 1,
        max: 50
    }
}

const articlesLengths = {
    title: {
        min: 1,
        max: 100
    },

    description: {
        min: 1,
        max: 200
    }
}

// Export
export {
    usersLengths,
    categoriesLengths,
    articlesLengths
};