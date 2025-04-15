import { gql } from '@apollo/client';
const addSingleBook = gql`
    mutation CreateBook(
        $name: String,
        $genreId: String,
        $des: String,
        $image: String, 
        $price: Int, 
        $quantity: Int, 
        $authorId: ID!
    ){
        createBook(input: {name: $name, genreId: $genreId, des: $des, image: $image, authorId: $authorId, quantity: $quantity, price: $price}){
            id
            name
        }
    }
`

const addSingleAuthor = gql`
    mutation addSingleAuthorMutation($name: String, $address: String, $age: Int){
        createAuthor(input: {
            name: $name,
            address: $address,
            age: $age,
        }){
            id
            name
        }
    }
`

const addSingleGenre = gql`
    mutation addSingleGenreMutation($name: String) {
        createGenre(input: {
            name: $name,
        }){
            id
            name
        }
    }
`

const addComments = gql`
    mutation CreateComment( $bookId: String, $email: String, $content: String, $icon: Int){
        createComment(input: {
            bookId: $bookId,
            content: $content,
            email: $email,
            icon: $icon
        }){
            id
            book {
                id
                name
            }
            user {
                name
                email
            }
            content
            icon
        }
    }
` 

const updateSingleAuthor = gql`
    mutation UpdateAuthor($id: ID!, $name: String, $address: String, $age: Int){
        updateAuthor(id: $id, input: {
            name: $name,
            address: $address,
            age: $age,
        }){
            id
            name
        }
    }
`

const deleteAuthor = gql`
    mutation DeleteAuthor($id: ID!){
        deleteAuthor(id: $id){
            name
        }
    }
`

const deleteGenre = gql`
    mutation DeleteGenre($id: ID!){
        deleteGenre(id: $id){
            name
        }
    }
`

const updateSingleBook = gql`
    mutation UpdateBook($id: ID!, $name: String, $genreId: String, $des: String, $image: String, $price: Int, $authorId: ID!,  $quantity: Int ){
        updateBook(id: $id, input: {name: $name, genreId: $genreId, price: $price, authorId: $authorId, image: $image, des: $des, quantity: $quantity}){
            id
            name
        }
    }
`

const updateSingleQuantityBook = gql`
    mutation UpdateQuantityBook($id: ID!, $count: Int ){
        UpdateQuantityBook(id: $id, input: {count: $count}){
            id
            name
        }
    }
`

const deleteBook = gql`
    mutation DeleteBook($id: ID!){
        deleteBook(id: $id){
            name
        }
    }
`

const signIn = gql`
    mutation signInMutation($name: String, $password: String, $avatar: String, $email: String){
        createUser(input: {
            name: $name, email: $email, avatar: $avatar, password: $password
        }){
            id
            name
            avatar
            email
            role
        }
    }
`

const logIn = gql`
    mutation loginMutation($name: String, $email: String){
        login(name: $name, email: $email){
            id
            name
            avatar
            email
            role
        }
    }
`


const createOrder = gql`
    mutation CreateOrder($name: String, $email: String, $address: String, $phone: Int, $listOrder: String, $status: Int){
        createOrder(input: {
            name: $name, email: $email, address: $address, phone: $phone, listOrder: $listOrder, status: $status
        }){
            id
            listOrder
            name
            phone
            email
            address
            status
        }
    }
`
const updateStatusOrder = gql`
    mutation UpdateStatusOrder($id: ID!, $status: Int){
        updateStatusOrder(id: $id, status: $status){
            name
            listOrder
            date
        }
    }
` 

const deleteStatusOrder = gql`
    mutation DeleteStatusOrder($id: ID!){
        deleteStatusOrder(id: $id){
            name
            listOrder
            date
        }
    }
`
const danhGiaOrder = gql`
    mutation DanhGiaOrder($id: ID!, $comments: String, $rating: Int){
        danhGiaOrder(id: $id, comments: $comments, rating: $rating){
            name
            listOrder
            date
        }
    }
` 

const deleteComment = gql`
    mutation DeleteComment($id: ID!){
        deleteComment(id: $id){
            id
            user {
                id
                email
                name
            }
            book {
                id
                name
            }
            icon
            content
        }
    }
`
const updateStatusComments = gql`
    mutation UpdateCommentStatus ( $icon: Int){
        updateCommentStatus(icon: $icon){
            id
            user {
                id
                email
                name
            }
            book {
                id
                name
            }
            icon
            content
        }
    }
`
export { addSingleBook, addSingleAuthor, updateSingleBook, 
    signIn, updateSingleAuthor,  deleteAuthor, deleteBook, createOrder, 
    updateStatusOrder, deleteStatusOrder, danhGiaOrder, logIn, addComments, deleteComment, deleteGenre, addSingleGenre, updateStatusComments, updateSingleQuantityBook }