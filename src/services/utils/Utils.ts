export default class Utils
{
	public static copyToClipboard( text: string )
	{
		const tempInput = document.createElement( 'input' );

		tempInput.value = text;
		document.body.appendChild( tempInput );
		tempInput.select();
		document.execCommand( 'copy' );
		document.body.removeChild( tempInput );
	}

	public static downloadAsFile( filename: string, text: string )
	{
		var element = document.createElement( 'a' );
		element.setAttribute( 'href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
		element.setAttribute( 'download', filename);
		
		element.style.display = 'none';
		document.body.appendChild(element);
		
		element.click();
		
		document.body.removeChild(element);
	}

	public static parseHtmlString( htmlString: string ): HTMLElement
	{
		const node		= document.createElement( 'div' ) as any;
		node.innerHTML	= htmlString;

		if ( node.childNodes.length === 1 )
		{
			return node.childNodes[0];
		}

		throw new Error(
			'Parsed htmlString must contain only one root HTML Element'
		);
	}
}