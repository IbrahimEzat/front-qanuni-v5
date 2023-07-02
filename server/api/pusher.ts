export default defineEventHandler((event) => {

    // create a blog
    // return the blog;
    // readBody(event).then((data) => {
    //     console.log(data.socket_id);
    //     return data.socket_id;
    // })
    return event.node.req.headers.authorization;
    //   event.node.res.send(event.node.req.headers.authorization);

});