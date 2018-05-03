

init = ( function() {




		initiateAnnouncement = ( function(){

			announcement = {
				addNew : function( oEvent, oContent ){
					
					var oDOMWrapper = document.createElement( 'div' );
					oDOMWrapper.classList.add( 'announcementWrapper' );
					
					oDOMWrapper.appendChild( announcement._createPositionInputDOM() );
					oDOMWrapper.appendChild( announcement._createTitleInputDOM() );
					oDOMWrapper.appendChild( announcement._createRemoveButtonDOM() );

					

					var oDOM = announcement._initTextAreaDOM();
					oDOMWrapper.appendChild( oDOM );
					document.getElementById( 'announcementContainer' ).appendChild( oDOMWrapper );

					announcement._initTinyMceDOM( oDOM.id, oContent );

					announcement.current.push( {
						id : oDOM.id
					} )		
				},
				import : function( oEvent ){

					

					announcement.exportDialog.getJsonPreview().value = '';
					announcement.exportDialog.getJsonPreview().placeholder = 'Paste your JSON here';
					announcement.exportDialog.getJsonPreview().removeAttribute( 'readonly' );

					announcement.exportDialog.get().classList.add( 'active' );
					selectAll( announcement.exportDialog.getJsonPreview().id );
					document.getElementById( 'loadReplaceButton' ).classList.add( 'active' );


				},
				loadJSONAnnouncement : function( oEvent ){

					var sValue = announcement.exportDialog.getJsonPreview().value;
					var oParsed = JSON.parse( sValue );

					announcement.removeAll();

					for ( var i = 0; i < oParsed.content.length; i++ )
					{
						announcement.addNew(null, oParsed.content[i] );
						
							announcement.current[i].body = oParsed.content[i].body;
							announcement.current[i].title = oParsed.content[i].title;
							announcement.current[i].position = oParsed.content[i].position;
							
							document.querySelector( '.title[data-index="' + i + '"]').value = oParsed.content[i].title;
							document.querySelector( '.position[data-index="' + i + '"]').value = oParsed.content[i].position;
							
						
					}





				},
				export : function( oEvent ){

					var oExportSchema = {
						forceVisible : true,
						content : []
					};

					for ( var i = 0; i < announcement.current.length; i++ )
					{
						var oContentSchema = {
						title : '',
						body : '',
						position : 0
					};

						announcement.current[i].body = tinymce.get( announcement.current[i].id ).getContent();
						announcement.current[i].title = document.querySelector( '.title[data-index="' + i + '"]').value;
						announcement.current[i].position = parseInt( document.querySelector( '.position[data-index="' + i + '"]').value ) || 0;

						oContentSchema.title = announcement.current[i].title;
						oContentSchema.body = announcement.current[i].body;
						oContentSchema.position = announcement.current[i].position;
						oExportSchema.content.push( oContentSchema );

					}

					document.getElementById( 'loadReplaceButton' ).classList.remove( 'active' );
					
					announcement.exportDialog.getJsonPreview().value = JSON.stringify( oExportSchema, null, 2 );
					announcement.exportDialog.getJsonPreview().setAttribute( 'readonly', true );
					announcement.exportDialog.get().classList.add( 'active' );
					selectAll( announcement.exportDialog.getJsonPreview().id );


				},
				exportDialog : {
					get : function(){
						return document.getElementById( 'exportDialog' );
					},
					getJsonPreview : function(){
						return document.getElementById( 'jsonPreview' );
					}
				},
				_createTitleInputDOM : function(){

					var iIndex = announcement.current.length;
					var oDOM = document.createElement( 'input' );
					oDOM.classList.add( 'title' );
					oDOM.placeholder = 'Input Title';
					oDOM.setAttribute( 'data-index', iIndex );

					return oDOM;
				},
				_createPositionInputDOM : function(){
					var iIndex = announcement.current.length;
					var oDOM = document.createElement( 'input' );
					oDOM.type = 'number';
					oDOM.classList.add( 'position' );
					oDOM.placeholder = 'Position';
					oDOM.setAttribute( 'data-index', iIndex );
					oDOM.value = iIndex;

					return oDOM;
				},
				_createRemoveButtonDOM : function(){

					var iIndex = announcement.current.length;
					var oDOM = document.createElement( 'button' );
					oDOM.classList.add( 'removeAnnouncementButton' );
					oDOM.innerText = 'Remove';
					oDOM.setAttribute( 'data-index', iIndex );
					oDOM.addEventListener( 'click', announcement.remove );
					return oDOM;
				},

				_initTextAreaDOM : function(){
					var oDOM = document.createElement( 'textarea' );
					var iId = ( announcement.current.length > 0 ) ?  announcement.current.length : 0;
					oDOM.id = 'announcement-' + iId;

					return oDOM;
				},
				_initTinyMceDOM : function( sID, oContent ){

					tinymce.init({
  selector: '#' + sID,
  height: 400,
  
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor textcolor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table contextmenu paste code help wordcount'
  ],
  toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
  init_instance_callback : function( editor ) {

  	if ( oContent )
  	{
  		editor.setContent( oContent.body, { format : 'html' } );
  	}
  	
  	editor.on( 'KeyUp', function( oEvent ){
  		
  	})
  }
});


				},
				removeAll : function(){

					for ( var i = 0; i < announcement.current.length; i++ )
					{
						if ( announcement.current[i].id === 'announcement-' + i )
						{
							tinymce.remove( '#announcement-' + i );
							var oTargetDOM = document.getElementById( 'announcement-' + i ).parentNode;
					oTargetDOM.parentNode.removeChild( oTargetDOM );

						}
					}
					announcement.current = [];
				},
				remove : function( oEvent ){
					var iIndex = parseInt( this.getAttribute( 'data-index' ) );
					for ( var i = 0; i < announcement.current.length; i++ )
					{
						if ( announcement.current[i].id === 'announcement-' + iIndex )
						{
							tinymce.remove( '#announcement-' + iIndex );
							var oTargetDOM = document.getElementById( 'announcement-' + iIndex ).parentNode;
					oTargetDOM.parentNode.removeChild( oTargetDOM );

					
							break;		
						}
					}

					var aNew = [];
					for ( var i = 0; i < announcement.current.length; i++ )
					{
						if ( announcement.current[i].id !== 'announcement-' + iIndex ) {
							aNew.push( announcement.current[i] );
						}
					}
					announcement.current = aNew;
					
					
					
				},
				current : [],

			}
			

			document.getElementById( 'addNewAnnouncement' ).addEventListener( 'click', this.announcement.addNew );
			document.getElementById( 'importButton' ).addEventListener( 'click', this.announcement.import );
			document.getElementById( 'loadReplaceButton' ).addEventListener( 'click', this.announcement.loadJSONAnnouncement );

			document.getElementById( 'exportButton' ).addEventListener( 'click', this.announcement.export );
			document.getElementById( 'exportDialogCloseButton' ).addEventListener( 'click', function( oEvent ){

				document.getElementById( 'exportDialog' ).classList.remove( 'active' );
				document.getElementById( 'jsonPreview' ).innerHTML = "";
			} );
			
			document.getElementById( 'jsonPreview' ).addEventListener( 'focus', function( oEvent ){
			 selectAll( this.id )
			} );


		})();



} )()


function selectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}
