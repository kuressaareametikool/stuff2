var http = require('http')
var exec = require('child_process').exec

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var webhookHandler = require('github-webhook-handler')
var handler = webhookHandler({ path: '/webhook', secret: 'secret' })

// Gulp tasks

gulp.task('default', function() {
    browserSync.init({
        server: { baseDir: "./" },
        port: 3000,
        ui: { port: 3001 },
        notify: false
    });
    gulp.watch(['./*.html', 'content/*.html']).on('change', browserSync.reload);
});

// Github webhook

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('No such location')
  })
}).listen(3002)

handler.on('error', function (err) {
    console.error(err.message)
})

handler.on('push', function (ev) {
    if (ev.payload.ref == 'refs/heads/master') {
        exec('git pull', function (error, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    }
})
