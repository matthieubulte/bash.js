bash.js
=======

This piece of javascript code is an attempt to create a hybrid javascript and bash-like code runner. This runner was written to integrate with the mongoshell and provide more powerful command line query mechanisms.

The runner's goal is to have the advantages of the unix shell (pipes, commands, aliases...) combined with the ease of use of javascript.

## Examples

##### Simple JavaScript
```
> 1 + 1
2
```

this example just show how normal javscript just runs
as expected.

---------------------------------------------

##### Commands
```
> id "xyz"
xyz
```

here we make use of the built-in `id` command that just
returns the input parameter (here a simple string)

---------------------------------------------

##### Pipes
```
> square 2 | _ + 2
4
```

it now gets interesting with the use of the pipe operator.
the pipe operator will take the result of the left side and
feed it to the right side under the `_` variable.

note: here, the square command is a user-defined command

---------------------------------------------
##### Mixed Pipes
```
> [1, 2, 3, 4] | Math.pow(2, _)
[2, 4, 8, 16]
```

when use with array, the pipe operator works as the javscript
map function. the right side of the expression will then be called
for every element of the array

---------------------------------------------
##### Nested Expressions
```
> square (id 4 | Math.sqrt(_)) | repeat "!" _
!!!!
```

this example shows how it is possible to nest expressions and pipes
while still mixing javascript and commands


## Usage

Here is how you would use the runner:

```
var core = new Core();
core.run("1 + 1"); // => 2
```

The other nice thing about this project is how easy it is to add commands
and aliases. Here's an example of adding the `add` command,

```
var core = new Core();
core.addCommand("add", function(x, y) {
	return x + y;
});

core.run("add 2 2"); // => 4
```

The last cool feature is also the support for aliases, for instance 
creating a `increment` alias for the `add` command,

```
core.addAlias("increment", "add 1 $1");

core.run("increment 1"); // => 2
```

Note: Accessing the alias' arguments is done using $n with n being the
argument number, starting at 1.

## Todo

+ add support for iterator in pipeline to be able to integrate with the mongoshell's dbcursor, iterator can be created from:
	+ an array
	+ 2 functions: `next` and `hasNext`
	
 
## License

bash.js is released under the [MIT License](http://www.opensource.org/licenses/MIT).
