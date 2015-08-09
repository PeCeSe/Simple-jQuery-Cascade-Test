$(document).ready(function () {

    var $count = 0;
    var $matchArray;
    var count = 30;
    var countStarted = false;

    setRandomColor = function ($this) {
        $colorNumber = Math.floor(Math.random() * (3 - 0));

        switch ($colorNumber) {
            case 0:
                $this.addClass('red');
                break;
            case 1:
                $this.addClass('green');
                break;
            default:
                $this.addClass('blue');
        }
    }

    $('.block').each(function () {

        setRandomColor($(this));
    });

    $('.block').click(function () {

        if (!countStarted) {
            startCountdown();
        }

        if (count > 0) {
            $matchArray = [$(this)];

            var $colorClass;

            if ($(this).hasClass('red')) {
                $colorClass = 'red';
            } else if ($(this).hasClass('green')) {
                $colorClass = 'green';
            } else if ($(this).hasClass('blue')) {
                $colorClass = 'blue';
            } else {
                $colorClass = 'error';
            }



            findAllSameColorNeighbours($(this), $colorClass);

            say(($matchArray.length) + "");



            if ($matchArray.length >= 3) {
                for (i = 0; i < $matchArray.length; i++) {
                    //$matchArray[i].effect("pulsate", { times: 1 }, 400);
                    $matchArray[i].fadeTo('fast', 0);
                    $matchArray[i].removeClass($colorClass);
                    setRandomColor($matchArray[i]);
                    $matchArray[i].fadeTo('fast', 1);
                };
                $('#score').text(parseInt($('#score').text()) + ($matchArray.length * $matchArray.length));
            } else {
                for (i = 0; i < $matchArray.length; i++) {
                    $matchArray[i].effect("shake", { distance: 5 }, 50);
                    $('#score').text(Math.floor(parseInt($('#score').text()) * 0.95));
                };
            }
        }

    });


    findAllSameColorNeighbours = function ($this, $colorClass) {

        say(getRowIndex($this) + '  ' + getCellIndex($this));

        //LEFT
        var $leftBlock = isLeftBlockSameColor($this, $colorClass);
        if ($leftBlock != null) {
            if (!(arrayContains($matchArray, $leftBlock))) {
                $matchArray.push($leftBlock);
                findAllSameColorNeighbours($leftBlock, $colorClass);
            }
        }

        //ABOVE
        var $aboveBlock = isAboveBlockSameColor($this, $colorClass);
        if ($aboveBlock != null) {
            if (!(arrayContains($matchArray, $aboveBlock))) {
                $matchArray.push($aboveBlock);
                findAllSameColorNeighbours($aboveBlock, $colorClass);
            }
        }

        //RIGHT
        var $rightBlock = isRightBlockSameColor($this, $colorClass);
        if ($rightBlock != null) {
            if (!(arrayContains($matchArray, $rightBlock))) {
                $matchArray.push($rightBlock);
                findAllSameColorNeighbours($rightBlock, $colorClass);
            }
        }

        //BELOW
        var $belowBlock = isBelowBlockSameColor($this, $colorClass);
        if ($belowBlock != null) {
            if (!(arrayContains($matchArray, $belowBlock))) {
                $matchArray.push($belowBlock);
                findAllSameColorNeighbours($belowBlock, $colorClass);
            }
        }
    };

    isAboveBlockSameColor = function ($block, $color) {
        var $this = $block;
        var $tr = $this.parent().parent();
        var col = $tr.children().index($this.parent());
        var $aboveBlock = $tr.prev().children().eq(col).children()
        var $blockClassMatch = $aboveBlock.hasClass($color);

        if ($blockClassMatch) {
            return $aboveBlock;
        }
        else {
            return null;
        }
    };

    isBelowBlockSameColor = function ($block, $color) {
        var $this = $block;
        var $tr = $this.parent().parent();
        var col = $tr.children().index($this.parent());
        var $belowBlock = $tr.next().children().eq(col).children()
        var $blockClassMatch = $belowBlock.hasClass($color);

        if ($blockClassMatch) {
            return $belowBlock;
        }
        else {
            return null;
        }
    };

    isLeftBlockSameColor = function ($block, $color) {
        var $this = $block;
        var $tr = $this.parent().parent();
        var col = $tr.children().index($this.parent().prev());
        if (col < 0) {
            col = null;
        }
        var $leftBlock = $this.parent().siblings().eq(col).children();
        var $blockClassMatch = $leftBlock.hasClass($color);

        if ($blockClassMatch) {
            return $leftBlock;
        }
        else {
            return null;
        }
    };

    isRightBlockSameColor = function ($block, $color) {
        var $this = $block;
        var $tr = $this.parent().parent();
        var col = $tr.children().index($this.parent());
        var $rightBlock = $this.parent().siblings().eq(col).children();
        var $blockClassMatch = $rightBlock.hasClass($color);

        if ($blockClassMatch) {
            return $rightBlock;
        }
        else {
            return null;
        }
    };


    arrayContains = function ($array, $object) {

        for (i = 0; i < $array.length; i++) {
            if (compareIndex($array[i], $object)) {
                return true;
            }
        };
        return false;
    };

    compareIndex = function ($obj1, $obj2) {

        if (((getRowIndex($obj1)) === (getRowIndex($obj2))) && (((getRowIndex($obj1) != null) && (getRowIndex($obj2)) != null))) {
            if (((getCellIndex($obj1)) === (getCellIndex($obj2))) && (((getCellIndex($obj1) != null) && (getCellIndex($obj2)) != null))) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    };

    getCellIndex = function ($this) {
        var $tr = $this.parent().parent();
        var index = $tr.children().index($this.parent());
        if (index < 0 || index > 3) {
            index = null;
        }
        return index;
    };

    getRowIndex = function ($this) {
        var $tr = $this.parent().parent();
        var index = $tr.index();
        if (index < 0 || index > 3) {
            index = null;
        }
        return index;
    };


    say = function (text) {
        console.log(text);
    };

    $('#startOver').click(function () {
        scramble();
        $('#score').text(0);
        count = 30;
        countStarted = false;
        $('.block').each(function () {
            $(this).removeClass('darken');
        });
    });
    
    $('#scramble').click(function () {
        if (count > 0) {
            scramble();
            $('#score').text(Math.floor(parseInt($('#score').text()) / 2));
        }
    });

    $(window).keydown(function (e) {
        if (count > 0) {
            if (e.keyCode === 32) {
                scramble();
                $('#score').text(Math.floor(parseInt($('#score').text()) / 2));
            }
        }
        if (e.keyCode === 13) {
            scramble();
            $('#score').text(0);
            count = 30;
            countStarted = false;
            $('.block').each(function () {
                $(this).removeClass('darken');
            });
        }
    });

    scramble = function () {
        $('.block').each(function () {
            $(this).fadeTo('fast', 0);
            if ($(this).hasClass('red')) {
                $(this).removeClass('red');
            } else if ($(this).hasClass('green')) {
                $(this).removeClass('green');
            } else if ($(this).hasClass('blue')) {
                $(this).removeClass('blue');
            }
            setRandomColor($(this));
            $(this).fadeTo('fast', 1);
        });
    }

    var counter;

    startCountdown = function () {
        countStarted = true;
        counter = setInterval(timer, 1000); //10 will  run it every 100th of a second
    };


    function timer() {
        if (count <= 0) {
            clearInterval(counter);
            $('.block').each(function () {
                $(this).addClass('darken');
            });
            if (parseInt($('#score').text()) > parseInt($('#highScore').text())) {
                parseInt($('#highScore').text($('#score').text()))
            }
            return;
        }
        count--;
        document.getElementById("timer").innerHTML = count + " sec";
    }
});


