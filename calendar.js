/**
 * Created by zqs on 2015/9/8.
 */
(function($) {
  var Calendar = function (ele, opt) {
    this.$element = ele,
    this.defaults = {
      width: '100%',
      height: 'auto',
      pre: {
        html:'<span class="glyphicon glyphicon-chevron-left" aria-hidden="true">上个月</span>',
        class:'btn btn-default'
      },
      next: {
        html:'<span class="glyphicon glyphicon-chevron-right" aria-hidden="true">下个月</span>',
        class:'btn btn-default'
      },
      callback: function () {}
    },
    this.options = $.extend({}, this.defaults, opt)

    this._date = moment();

  };

  Calendar.prototype = {
    createCalendar: function() {
      this.$wrapper = $('<div class="calendar"></div>');
      this.$wrapper.appendTo(this.$element);
      this.renderCalendar();
      this.$element.data('calendar', this);
    },

    _createCalendarHeader: function () {
      var year = this._date.year();
      var month = this._date.month();
      var $header = $('<div class="header"></div>');
      $header.appendTo(this.$wrapper);

      var $headerLeft = $('<div class="header-left"></div>')
          .appendTo($header);
      var $pre = $('<a>pre</a>')
          .addClass(this.options.pre.class)
          .html(this.options.pre.html);
      $pre.on('click', {calendar:this}, function(event) {
        event.data.calendar.preMonth();
      });
      $pre.appendTo($headerLeft);
      var $headerCenter = $('<div class="header-center"></div>')
          .appendTo($header);
      var $headerRight = $('<div class="header-right"></div>')
          .appendTo($header);
      var $next = $('<a>next</a>')
          .addClass(this.options.next.class)
          .html(this.options.next.html);
      $next.on('click', {calendar:this}, function(event) {
        event.data.calendar.nextMonth();
      });
      $next.appendTo($headerRight);
    },


    _createCalendarBody: function () {
      var year = this._date.year();
      var month = this._date.month();
      var $body = $('<div class="body"></div>');
      $body.appendTo(this.$wrapper);
      // create table element
      var $table	= $('<table><thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>七</th></tr></thead></table>')
          .css("width", this.options.width)
          .css("height", this.options.height)
          .appendTo($body);

      var date = moment({ year :year, month :month, day :1, hour :0, minute :0, second :0, millisecond :0});
      var daysInMonth = date.daysInMonth();   //当月总共有几天
      var startDayOfWeek = date.date(1).day(); //当月的第一天星期数
      var endDayOfWeek = date.date(daysInMonth).day(); //当月的第一天星期数
      if(startDayOfWeek == 0) {
        startDayOfWeek = 7;
      }
      var weeks = Math.ceil(1+(daysInMonth-(7-startDayOfWeek+1))/7);    //当月的星期数
      for(var row=1; row<=weeks; row++) {
        var $week = $('<tr></tr>').appendTo($table);
        for(var col=1; col<=7; col++) {
          var $day = $('<td></td>').appendTo($week);

          if(row == 1) {  //第一行
            if(col>=startDayOfWeek) {
              $day.text(col-startDayOfWeek+1);
            }
          } else if(row == weeks) {   //最后一行
            if(col<=endDayOfWeek) {
              $day.text((7-startDayOfWeek+1)+(row-1-1)*7+col);
            }
          } else {
            $day.text((7-startDayOfWeek+1)+(row-1-1)*7+col);
          }
          if($day.text() != '') {
            var dateAttr =  moment({ year :year, month :month, day :$day.text(), hour :0, minute :0, second :0, millisecond :0}).format('YYYY-MM-DD');
            $day.attr('date', dateAttr);
          }
        }
      }
    },

    renderCalendar: function() {
      this.renderHeader();
      this.renderBody();
      this.highlightToday();
      if(this.options.callback) {
        this.options.callback(this._date);
      }
    },

    renderHeader: function() {
      if(this.$wrapper.find('.header').size() == 0) {
        this._createCalendarHeader();
      }
      this.setTitle();
    },

    renderBody: function() {
      this.$wrapper.find('.body').remove();
      this._createCalendarBody();
    },

    setTitle: function() {
      this.$wrapper.find('.header-center').text(this._date.year()+'年'+(this._date.month()+1)+'月');
    },

    highlightToday: function() {
      var now = moment().format('YYYY-MM-DD');
      this.$wrapper.find('td[date='+now+']').css('color', '#ef5350').css('font-weight', '700');
    },

    preMonth: function() {
     this. _date.subtract(1, 'months');
      this.renderCalendar();
    },

    nextMonth: function() {
      this._date.add(1, 'months');
      this.renderCalendar();
    },

    today: function() {
      this._date = moment();
      this.renderCalendar();
    }
  }

  $.fn.extend({
    calendar: function (opt) {
      return this.each(function () {
        var calendar = $(this).data('calendar');
        if (calendar) {
          if ($.type(opt) === 'string') {
            switch (opt) {
              case 'today':
                calendar.today();
                break;
            }
          }
        }
        if ($.type(opt) !== 'string') {
          var calendar = new Calendar($(this), opt);
          calendar.createCalendar();
        }
      });
    }
  })
})(jQuery);