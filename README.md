## what is this?
this is a parser for a markup 'language' I created called markzilla. I did it mainly as a learning exercise -- I learned everything I'll ever need to know about regex, for example. but if you need a simple markup language that outputs a JSON object full of HTML elements (and who doesn't?) then this project may be useful to you.

### quick start
clone the repo, open the folder. open index.html. open your console and run `mkz.parse(filePath)`, then `mkz.saveToPost(elements)`, then `mkz.insertPost(postObject)` to get a basic idea of what it does.

### how markzilla markup (.mkz) syntax works
markzilla has a syntax designed specifically around writing articles/posts/documents that will need to be rendered as HTML. therefore all the markzilla *markup indicators* are based on HTML elements.

the line indicators as of right now are #p, #h1-#h6, #img, and #code. these are the only ones I needed originally which is why there are so few. however I'll add more if there seems to be a reason. they can't be combined as of right now, but I don't think they need to be.

the style indicators, which do things like make text italic and stuff, are s(trikethrough), i(talic), b(old), u(nderline), c(ode), o(verline), and d(rop-cap). these can be combined, of course.
be careful to only place one character in a drop-cap indicator, otherwise it becomes more of a...drop-word.

the methods of using these indicators are demonstrated in `test.mkz`.

### functionality
every method you need for parsing markzilla and recieving the output is in the `markzilla` / `mkz` object. for example, get the path to your `.mkz` file, and call mkz like this: `mkz.parse('path/to/file')`
and it will give you an array of numbered JSON objects containing the parsed `.mkz` lines. running `mkz.parse()` using my test file as input converts a line that looks like this:

`#h1 [i This] is a [b markzilla] test file. This is the [sui first ever] [ib markzilla] file.`

to a line that looks like this.

```<h1><span class='i'>This</span> is a <span class='b'>markzilla</span> test file. This is the <span class='s u i'>first ever</span> <span class='i b'>markzilla</span> file.
</h1>```

it's a pretty straightforward `.mkz` to `.html` conversion. if for some reason you *actually* want to use this, like to make blog posts on a static site or something, please feel free. and if you need help or want me to put in a new feature, please get in touch. I'm online almost 24/7 these days.
