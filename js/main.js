var todo = {
	init: function( config ) {
		this.container = config.container;
		this.taskFormContainer = config.taskFormContainer;
		this.taskInput = config.taskInput;
		this.template = Handlebars.compile( config.template );

		this.bindEvents();

		this.addStorageTasksToDOM();

		this.taskInput.focus();
	},

	bindEvents: function() {
		var self = this;

		self.taskInput.on( 'keydown', function( event ) {
			if ( event.keyCode === 13 && !event.shiftKey ) { // enter key pressed with no shift
				if ( self.taskInput.val() !== '' ) {	
					self.addTask( self.taskInput.val() );
					self.taskInput.val( '' );
				}

				self.taskFormContainer.slideUp();
				event.preventDefault();
			}
		});

		this.container.on( 'click', 'span', function() {
			self.removeTask( $(this).parent('li') );
		});

		$( document ).on( 'keydown', function( event ) {
			if ( !self.taskFormContainer.is(':hidden') ) return;


			switch( event.which ) {
				// 'c'
				case 67:
					self.removeAllTasks();
					break;

				// 'n'
				case 78:
					self.taskFormContainer.slideDown();
					self.taskInput.select();
					event.preventDefault();
					
					break;
			}
		});
	},

	/**
	 * Adds all tasks in local storage to the DOM.
	 */
	addStorageTasksToDOM: function() {
		if ( localStorage.tasks ) {
			var taskArr = JSON.parse( localStorage['tasks'] ),
				self = this;
			$.each( taskArr, function( index, value ) {
				self.addTaskToDOM( value );
			});
		}
	},
	
	 /**
	  * Adds the specified task to localStorage and adds the task to the DOM.
	  * @param {string} taskText the text of the task
	  */
	addTask: function( taskText ) {
		if ( localStorage.tasks ) {
			var taskArr = JSON.parse( localStorage['tasks'] );
			taskArr.push( taskText );
			localStorage['tasks'] = JSON.stringify( taskArr );
		} else {
			localStorage['tasks'] = JSON.stringify( [taskText] );
		}

		this.addTaskToDOM( taskText );
	},

	/**
	 * Adds the specified task to the DOM, using the template.
	 * @param {string} taskText text of the task
	 */
	addTaskToDOM: function( taskText ) {
		this.container.append( this.template({ task: taskText }) );
	},

	/**
	 * Deletes the specified task list item from localStorage and hides it in the DOM.
	 * @param  {jQuery} li jQuery list item object holding the task to remove
	 */
	removeTask: function( li ) {
		var task = li.children('div').html(),
			taskArr = JSON.parse( localStorage['tasks'] );
		taskArr.splice( taskArr.indexOf( task ), 1 );
		localStorage['tasks'] = JSON.stringify( taskArr );

		/* Instead of removing the element from the DOM, only hide it so
		 * previous tasks keep their original color. */
		li.fadeOut( 500 ); 
	},

	/**
	 * Removes all tasks from local storage and DOM.
	 */
	removeAllTasks: function() {
		localStorage.clear();
		this.container.children( 'li' ).remove();
	}
};
