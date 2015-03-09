(function($) {
	$.fn.serializeObject = function () {
		"use strict";
		var a = {}, b = function (b, c) {
				var d = a[c.name];
				"undefined" != typeof d && d !== null ? $.isArray(d) ? d.push(c.value) : a[c.name] = [d, c.value] : a[c.name] = c.value
			};
		return $.each(this.serializeArray(), b), a
	};

	$.fn.superSearch = function(opts) {
		var superSearch = {
			wrapper: null,
			init: function(wrapper, opts){
				this.wrapper = wrapper;
				this.opts = $.extend({
					ajax: false
				},opts);
				$(this.wrapper).on('submit', $.proxy(this.formSubmit, this));
				if (this.opts.ajax) {
					$(this.wrapper).find(this.opts.ajax).on('change', $.proxy(this.FormChange, this));
				};
				$('[super-search-btn]').on('click', $.proxy(this.Btn, this));
			},
			Btn: function(e){
				e && e.preventDefault();
				var $target = $(e.target);
				if ($target.parents('li').hasClass('active')) {
					$target.parents('li').removeClass('active');
					this.wrapper
						.find('[name="'+ $target.data('name') +'"]')
						.val('');
				} else {
					this.wrapper
						.find('[name="'+ $target.data('name') +'"]')
						.val($target.data('value'));
					$target.parents('li').siblings().removeClass('active');
					$target.parents('li').addClass('active');
				}
				this.FormChange();
			},
			FormChange: function(e){
				e && e.preventDefault();
				var elems = $('[super-search-list]').addClass('loading').find(' > *')
				TweenMax.staggerTo(elems, 0.3, {scale:0.5, opacity:0, ease: Quart.easeIn}, 0.2);
				$.ajax({
					url: this.getUrl(),
					type: 'get',
					complete: $.proxy(this.ajaxComplete, this)
				});
			},
			ajaxComplete: function(xhr, status){
				var html = $(xhr.responseText);
				$('[super-search-list]').replaceWith(html.find('[super-search-list]'));
				TweenMax.staggerFrom('[super-search-list] > *', 1, {scale:0.5, opacity:0, ease:Quart.easeOut}, 0.1);
				page = html.find('.next-page a').attr('href');
				if ( ! page) {
					$('#load-more').hide();
				} else {
					$('#load-more').show();
				}
			},
			formSubmit: function(e){
				e.preventDefault();
				top.location.href = this.getUrl();
			},
			getUrl: function(){
				var url = $(this.wrapper).attr('action')+'/';
				var url_params = {};
				$.each($(this.wrapper).serializeArray(), function () {
					url_params[this.name] = this.value;
				});
				base64_string = Base64.encode(JSON.stringify(url_params));
				return url + encodeURIComponent(base64_string.replace('/', '\\')) + '/0/';
			}
		};
		if (this.length>1) {
			var objects = [];
			$(this).each(function(){
				var instance = Object.create(superSearch);
				instance.init(this,opts);
				objects.push(instance);
			});
			return objects;
		} else {
			var instance = Object.create(superSearch);
			instance.init(this,opts);
			return instance;
		}
	}
})(jQuery);

