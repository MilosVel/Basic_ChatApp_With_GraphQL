mora se koristiti node 18.0.0

Tabela User ima: username i password
Tabela Message ima: id, user, text, createdAt


subscription{
    messageAdded{
        id
        user
        text
    }
}