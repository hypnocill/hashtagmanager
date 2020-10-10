import Utils				from "../utils/Utils";
import { iRoutingParams }	from "./Router";

export default abstract class ViewController
{
	protected rootElement: HTMLElement;
	protected template: HTMLElement;
	protected components: any = {};

	constructor( rootElement: HTMLElement, htmlTemplateString: string )
	{
		this.rootElement	= rootElement;
		this.template		= Utils.parseHtmlString( htmlTemplateString );
	}

	public mount( params: iRoutingParams )
	{
		this.rootElement.appendChild( this.template );
	}

	public unmount()
	{
		this.template.remove();
	}

	/**
	 * @brief	Unsets all Components set as property in the descendant classes
	 * 
	 * @details	'this.components' in descendant classes can be used for components directly
	 * 			e.x. this.components.{component}	= Component
	 * 			Or it can be used to store multiple components of the same type in a key
	 * 			e.x. this.components.{manyComponents}	= Component[]
	 * 
	 * 			In both examples, this function will call 'Component.destructor()' and will unset
	 * 			all components keys in order to remove all references to those components and prevent
	 * 			memory leaks
	 */
	protected unsetComponents(): void
	{
		for ( const key in this.components )
		{
			if ( this.components.hasOwnProperty( key ) )
			{
				const component			= this.components[key];
				const componentProto	= component ? Object.getPrototypeOf( component ) : null;

				if ( componentProto && componentProto.destructor )
				{
					component.destructor();
				}
				else if ( typeof component === 'object' )
				{
					for ( const nestedComponentKey in component )
					{
						const nestedComponentProto	= component[nestedComponentKey]
													? Object.getPrototypeOf( component[nestedComponentKey] )
													: null;

						if ( nestedComponentProto && nestedComponentProto.destructor )
						{
							component[nestedComponentKey].destructor();
						}
					}
				}

				this.components[key]	= null;
			}
		}
	}
}




