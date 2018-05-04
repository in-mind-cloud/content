

init = ( function() {




		initiateAnnouncement = ( function(){

			announcement = {

				l10n : {
					addNew : function( oEvent, sL10nKey )
					{
						var sLocaleContainerID = 'id_' + Math.floor( Math.random() * Math.floor( 999999999 ) ).toString();
						var oDOM = document.createElement( 'li' );
						oDOM.addEventListener( 'click', announcement.l10n.onSelected );

						var oADOM = document.createElement( 'input' );
						

						oADOM.classList.add( 'l10nEditable' );
						oADOM.setAttribute( 'data-l10n', ( sL10nKey || '' ) );
						oADOM.value = ( sL10nKey || '' );
						oDOM.setAttribute( 'data-localecontainerid', sLocaleContainerID );

						oDOM.appendChild( oADOM );


						var oRemoveDOM = document.createElement( 'button' );
						oRemoveDOM.innerText = 'X';
						oRemoveDOM.classList.add( 'removeL10nButton' );
						oRemoveDOM.addEventListener( 'click', announcement.l10n.removeL10n );

						oDOM.appendChild( oRemoveDOM );
						

						var oAnnouncementContainerDOM = announcement.getAnnouncementContainerDOM();
						var oLocaleContainerDOM = announcement.addNewLocaleContainer();
						oLocaleContainerDOM.setAttribute( 'id', sLocaleContainerID );

						if ( !sL10nKey )
							oLocaleContainerDOM.classList.add( 'active' );

						if ( sL10nKey )
							oLocaleContainerDOM.setAttribute( 'data-l10n', sL10nKey );

						//first
						var aEditable = document.getElementsByClassName( 'l10nEditable' );
						if ( aEditable.length === 0 )
						{
							oADOM.setAttribute( 'data-l10n', 'en' );
							oADOM.value = 'en';
							oADOM.setAttribute( 'readonly', true );
							oDOM.classList.add( 'selected' );
							oLocaleContainerDOM.setAttribute( 'data-l10n', 'en' );
							oDOM.removeChild( oRemoveDOM );
						}


						oADOM.addEventListener( 'keyup', function( oEvent ){
							this.setAttribute( 'data-l10n', this.value );

							if ( this.parentNode.classList.contains( 'selected' ) )
							{
								document.querySelector( '.announcementContainerTitle' ).innerText = this.value;
								oLocaleContainerDOM.setAttribute( 'data-l10n', this.value );
							}

						});

						announcement.l10n.getTabDOM().appendChild( oDOM );
					},
					removeL10n : function( oEvent ){
						var sLocaleContainerID = this.parentNode.getAttribute( 'data-localecontainerid' );

						for ( var i = announcement.current.length -1; i > 0; i-- )
						{
							if ( announcement.current[i].localeContainerId === sLocaleContainerID )
							{
								tinymce.remove( '#' + announcement.current[i].id );
								document.getElementById( announcement.current[i].id ).parentNode.removeChild( document.getElementById( announcement.current[i].id ) );
								announcement.current.splice( i, 1 );
							}
						}


						document.getElementById( 'l10nTab' ).removeChild( this.parentNode );
						document.getElementById( 'announcementContainer' ).removeChild( document.getElementById( sLocaleContainerID ) );
						this.parentNode.removeEventListener( 'click', announcement.l10n.onSelected );


						var aLiDOM = announcement.l10n.getTabDOM().querySelectorAll( 'li[data-localecontainerid]' );

						if ( aLiDOM.length > 0 )
						{
							announcement.l10n.fireSelected( aLiDOM[ aLiDOM.length - 1 ] );
						}

					},
					getTabDOM : function(){
						var oDOM = document.getElementById( 'l10nTab' );
						return oDOM;
					},
					getAllL10nTabDOM : function(){
						return document.querySelectorAll( '#l10nTab li' );
					},
					getAllLocaleContainer : function(){
						return document.querySelectorAll( '.localeContainer[data-l10n]' );
					},
					fireSelected : function( oDOM ){
						announcement.l10n.onSelected( null, oDOM );
					},
					onSelected : function( oEvent, oDOM ){

						var oThis = this;
						if ( oDOM )
							oThis = oDOM;

						announcement.l10n.getAllLocaleContainer().forEach( function( oDOM ){
							oDOM.classList.remove( 'active' );
						});

						announcement.l10n.getAllL10nTabDOM().forEach( function( oDOM ){
							oDOM.classList.remove( 'selected' );
						});
						oThis.classList.add( 'selected' );
						document.querySelector( '.announcementContainerTitle' ).innerText = oThis.querySelector( 'input' ).value;

						var sLocaleContainerID = oThis.getAttribute( 'data-localecontainerid' );
						var localeContainerDOM = document.querySelector( '.localeContainer#' + sLocaleContainerID );

						if ( !localeContainerDOM )
							announcement.addNewLocaleContainer();

						localeContainerDOM.classList.add( 'active' );

					},

				},
				addNew : function( oEvent, oContent, sL10nKey ){


					var oDOMWrapper = document.createElement( 'div' );
					oDOMWrapper.classList.add( 'announcementWrapper' );
					
					oDOMWrapper.appendChild( announcement._createPositionInputDOM() );
					oDOMWrapper.appendChild( announcement._createTitleInputDOM() );
					oDOMWrapper.appendChild( announcement._createRemoveButtonDOM() );

					

					var oDOM = announcement._initTextAreaDOM();
					oDOMWrapper.appendChild( oDOM );

					var oSelectedL10nTab = document.querySelector( '#l10nTab li.selected' );
					var l10nKey = oSelectedL10nTab.querySelector( 'input' ).getAttribute( 'data-l10n' );
					if ( sL10nKey )
						{
							l10nKey = sL10nKey;
							oSelectedL10nTab = document.querySelector( '#l10nTab li input[data-l10n="' + sL10nKey + '"]' ).parentNode;
						}

					document.querySelector( '.localeContainer[data-l10n="' + l10nKey + '"]' ).appendChild( oDOMWrapper );

					if ( sL10nKey )
					{
						announcement._initTinyMceDOM( oDOM.id, oDOM, true );
					}
					else {
					announcement._initTinyMceDOM( oDOM.id, oContent );
					}

					announcement.current.push( {
						id : oDOM.id,
						localeContainerId : oSelectedL10nTab.getAttribute( 'data-localecontainerid' )
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
					var aL10nKey = [];

					announcement.removeAll();
					var iDataIndex = 0;

					for ( var i = 0; i < oParsed.content.length; i++ )
					{
						if ( i === 0 ){
							for ( var sL10nKey in oParsed.content[i].title )
							{
								aL10nKey.push( sL10nKey );
								if ( sL10nKey !== 'en' )
									announcement.l10n.addNew( null, sL10nKey );
							}
							
						}

						for ( var sL10nKey in oParsed.content[i].title )
						{

							if ( i > 0 && sL10nKey === 'en' && oParsed.content[i].title[sL10nKey] === '' )
							{

							}
							else
							{
								announcement.addNew( null, oParsed.content[i], sL10nKey );
								announcement.current[iDataIndex].body = oParsed.content[i].body[sL10nKey];
								announcement.current[iDataIndex].title = oParsed.content[i].title[sL10nKey];
								announcement.current[iDataIndex].position = oParsed.content[i].position;

									document.querySelector( '.title[data-index="' + iDataIndex + '"]' ).value = oParsed.content[i].title[sL10nKey];
								document.querySelector( '.position[data-index="' + iDataIndex + '"]' ).value = oParsed.content[i].position;
								iDataIndex++;
							}

							
						}



							
						

							
							
						
					}





				},
				export : function( oEvent ){

					var oExportSchema = {
						forceVisible : true,
						content : []
					};

					
					var oSortedByL10n = {};


					for ( var i = 0; i < announcement.current.length; i++ )
					{
						

						var currentSelectedL10n = document.querySelector( '#' + announcement.current[i].localeContainerId ).getAttribute( 'data-l10n' );

						announcement.current[i].body = tinymce.get( announcement.current[i].id ).getContent();
						announcement.current[i].title = document.querySelector( '.title[data-index="' + i + '"]').value;
						announcement.current[i].position = parseInt( document.querySelector( '.position[data-index="' + i + '"]').value ) || 0;

						if ( !oSortedByL10n[ currentSelectedL10n ] || oSortedByL10n[ currentSelectedL10n ].constructor !== Array )
							oSortedByL10n[ currentSelectedL10n ] = [];

						oSortedByL10n[ currentSelectedL10n ].push( announcement.current[i] );
						
					}

					var iMaxAnnouncementWidget = 0;
					
					for ( var sL10nKey in oSortedByL10n ) {

						if ( oSortedByL10n[ sL10nKey ].length > iMaxAnnouncementWidget )
							iMaxAnnouncementWidget = oSortedByL10n[ sL10nKey ].length;

					}

					for ( var i = 0; i < iMaxAnnouncementWidget; i++ )
					{
						var oContentSchema = {
						title : { en : '' },
						body : { en : '' },
						position : 0
						};
						oExportSchema.content.push( oContentSchema );
					}


					for ( var i = 0; i < oExportSchema.content.length; i++ )
					{
						for ( var sL10nKey in oSortedByL10n )
						{
							oSortedByL10n[sL10nKey].forEach( function( oObj, index ){

								if ( index === i ) {
									oExportSchema.content[i].title[ sL10nKey ] = oObj.title;
									oExportSchema.content[i].body[ sL10nKey ] = oObj.body;
									oExportSchema.content[i].position = oObj.position;
								}
							})
							
						}

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
				getAnnouncementContainerDOM : function(){
					return document.getElementById( 'announcementContainer' );
				},
				addNewLocaleContainer : function(){
					//TODO
					var oDOM = document.createElement( 'div' );
					oDOM.classList.add( 'localeContainer' );
					oDOM.setAttribute( 'data-l10n', '' );

					document.getElementById( 'announcementContainer' ).appendChild( oDOM );

					return oDOM;

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
					oDOM.value = 0;

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
				_initTinyMceDOM : function( sID, oContent, bImport ){

					tinymce.init({
  selector: '#' + sID,
  height: 400,
   branding: false,
  menubar: false,
  plugins: [
    'advlist autolink lists link image charmap print preview anchor textcolor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table contextmenu paste code help wordcount'
  ],
  toolbar: 'insert | undo redo |  formatselect | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
  init_instance_callback : function( editor ) {

  	if ( oContent && !bImport )
  	{
  		editor.setContent( oContent.body, { format : 'html' } );
  	}
  	else if ( bImport )
  	{
  		var index = parseInt( oContent.id.replace( 'announcement-', '' ) );

  		editor.setContent( announcement.current[index].body, { format : 'html' } );	
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
			
			document.getElementById( 'addL10n' ).addEventListener( 'click', this.announcement.l10n.addNew );
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


			announcement.l10n.addNew();

		})();



} )()


function selectAll(id)
{
    document.getElementById(id).focus();
    document.getElementById(id).select();
}
