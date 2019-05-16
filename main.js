window.commandList = ['cat', 'clear', 'help', 'ls', 'man', 'ps'];
window.ls = 'list all files in the current directory.';
window.help = 'list possible terminal commands.';
window.cat = 'cat [filename] will print the contents of that file.';
window.clear = 'clear all text in the terminal.';
window.reverse = 'reverse to the previous section of the page.';
window.man = 'describe a file, but you know that already don\'t you?';
window.ps = 'list the current processes';

window['about.txt'] = 'This is an experiment to see how much of the linux terminal can be replicated using only JavaScript/jQuery/Pug/Css.';
window['projects.txt'] = 'Ubuntu is a Debian-based Linux operating system for personal computers, tablets and smartphones, where Ubuntu Touch edition is used. It also runs network servers. That is usually with the Ubuntu Server edition, either on physical or virtual servers (such as on mainframes) or with containers, that is with enterprise-class features. It runs on the most popular architectures, including server-class ARM-based.';
window['loremipsum.txt'] = 'In publishing and graphic design, lorem ipsum is a filler text or greeking commonly used to demonstrate the textual elements of a graphic document or visual presentation. Replacing meaningful content with placeholder text allows designers to design the form of the content before the content itself has been produced.';

let files = ['about.txt', 'projects.txt'];
let allFiles = ['about.txt', 'projects.txt', 'loremipsum.txt'];
let user = 'root@user:~$';
let commandHistory = [];
let commandIndex = -1;

function currentBrowser() {
    let is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
    let is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
    let is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
    let is_safari = navigator.userAgent.indexOf("Safari") > -1;
    let is_edge = navigator.userAgent.indexOf("Edge") > -1;
    let is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;

    if (is_chrome && is_safari && is_edge) {
        is_chrome = false;
        is_safari = false;
    } else if ((is_chrome) && (is_safari)) {
        is_safari = false;
    } else if ((is_chrome) && (is_opera)) {
        is_chrome = false;
    }
    if (is_chrome) {
        return 'Chrome';
    } else if (is_explorer) {
        return 'Internet Explorer';
    } else if (is_firefox) {
        return 'Firefox';
    } else if (is_safari) {
        return 'Safari';
    } else if (is_edge) {
        return 'Edge';
    } else if (is_opera) {
        return 'Opera';
    } else {
        return 'Browser';
    }
}

$(document).ready(function () {
    $("#terminal").on('click', function () {
        $("#terminalInput").focus();
    });

    function sendCommand(input) {
        let command = input.split(' ')[0];
        let secondary = input.split(' ')[1];

        if ((commandList.indexOf(command) === -1 && command != "continue") && command) {
            replaceInput();
            $("#terminalOutput").append('Invalid command \"' + command + '"<br>type "help" for more options<br>');
            addInput();
        }

        if (input === 'ls -la' || input === 'ls -a' || input === 'ls -all' || input === 'ls -l') {
            printAllFiles();
            return;
        }

        switch (command) {
            case 'ls':
                printFiles();
                break;
            case 'cat':
                if (!secondary)
                    break;
                printFile(secondary);
                break;
            case 'help':
                printList(commandList);
                break;
            case 'clear':
                clear();
                break;
            case 'man':
                if (secondary)
                    man(secondary);
                break;
            case 'ps':
                replaceInput();
                $("#terminalOutput").append("PID TTY&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME CMD<br>" +
                    '6258 pts/1&nbsp;&nbsp;    00:00:00 bash<br>' +
                    '7334 pts/1&nbsp;&nbsp;    00:00:00 ps<br>' +
                    '8942 pts/1&nbsp;&nbsp;    00:00:00 ' + currentBrowser() + '<br>');
                addInput();
                break;
        }
    }

    function man(input) {
        if (commandList.indexOf(input) > -1) {
            replaceInput();
            $("#terminalOutput").append('"' + input + '"' + '  ' + this[input] + '<br>');
            addInput();
        } else {
            replaceInput();
            $("#terminalOutput").append('"' + input + '"' + '  is not a valid command, try typing "help" for options.<br>');
            addInput();
        }
    }

    function clear() {
        replaceInput();
        $("#terminalOutput").empty();
        addInput();
    }

    function printFile(file) {
        if (this[file]) {
            replaceInput();
            $("#terminalOutput").append(this[file] + '<br>');
            addInput();
        } else {
            replaceInput();
            $("#terminalOutput").append('"' + file + '"' + ' is an invalid file name.  Try typing "ls".<br>');
            addInput();
        }
    }

    function printList(list) {
        replaceInput();
        list.forEach(function (result) {
            $("#terminalOutput").append(result + '<br>');
        });
        addInput();
    }

    function printFiles() {
        replaceInput();
        files.forEach(function (file) {
            $("#terminalOutput").append(file + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        });
        $("#terminalOutput").append('<br>');
        addInput();
    }

    function printAllFiles() {
        replaceInput();
        allFiles.forEach(function (file) {
            $("#terminalOutput").append(file + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
        });
        $("#terminalOutput").append('<br>');
        addInput();
    }

    function replaceInput() {
        let value = $("#terminalInput").val();
        $("#terminalInput").remove();
        $("#terminalOutput").append(value + '<br>');
    }

    function addInput() {
        $("#terminalOutput").append(user + ' <input id="terminalInput" spellcheck="false"></input>');

        setTimeout(function () {
            $("#terminalInput").focus();
        }, 10);


        $("#terminalInput").keydown(function (e) {
            let command = $("#terminalInput").val();
            if (e.keyCode == 13) {
                sendCommand(command);
                commandHistory.unshift(command);
                commandIndex = -1;
            } else if (e.keyCode == 9) {
                e.preventDefault();
                autoCompleteInput();
            } else if (e.keyCode == 38 && commandIndex != commandHistory.length - 1) {
                e.preventDefault();
                commandIndex++;
                $("#terminalInput").val(commandHistory[commandIndex]);
            } else if (e.keyCode == 40 && commandIndex > -1) {
                e.preventDefault();
                $("#terminalInput").val(commandHistory[commandIndex]);
                commandIndex--;
            } else if (e.keyCode == 67 && e.ctrlKey) {
                $("#terminalInput").val(command + '^C');
                replaceInput();
                addInput();
            }
        });
    }

    function autoCompleteInput() {
        let command = $("#terminalInput").val();
        let input = $("#terminalInput").val().split(' ');
        let validList = [];
        let fileList = input[0] === 'man' ? commandList : allFiles;

        if (input.length === 2 && input[1] != "") {
            fileList.forEach(function (file) {
                if (file.substring(0, input[1].length) === input[1]) {
                    validList.push(file);
                }
            });
            if (validList.length > 1) {
                replaceInput();
                validList.forEach(function (option) {
                    $('#terminalOutput').append(option + '   ');
                });
                $('#terminalOutput').append('<br>');
                addInput();
                $("#terminalInput").val(command);
            } else if (validList.length === 1) {
                $("#terminalInput").val(
                    command +
                    validList[0].substring(input[1].length, validList[0].length));
            }
        } else if (command.length) {
            commandList.forEach(function (option) {
                if (option.substring(0, input[0].length) === input[0]) {
                    validList.push(option);
                }
            });
            if (validList.length > 1) {
                replaceInput();
                validList.forEach(function (option) {
                    $('#terminalOutput').append(option + '   ');
                });
                $('#terminalOutput').append('<br>');
                addInput();
                $("#terminalInput").val(command);
            } else if (validList.length === 1) {
                $("#terminalInput").val(
                    command +
                    validList[0].substring(input[0].length, validList[0].length));
            }
        }
    }

    addInput();
});
