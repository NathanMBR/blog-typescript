// Users
interface UsersTable {
    name: string;
    email: string;
    password: string;
    is_admin?: boolean;
    is_email_public?: boolean;
    profile_picture: string | null;
    slug: string;
}

interface CategoriesTable {
    category: string;
}

interface ArticlesTable {
    title: string;
    description: string;
    article: string;
    category_id: number;
    author_id: number;
    slug: string;
}

interface CommentariesTable {
    commentary: string;
    article_id: number;
    commentary_id: number | null;
    author_id: number;
}

// Export
export {
    UsersTable,
    CategoriesTable,
    ArticlesTable,
    CommentariesTable
};