import Component from "@/services/component/Component";

export default class DropdownDataList extends Component<HTMLInputElement>
{
	dataList: HTMLDataListElement;

	constructor( id: string | HTMLInputElement )
	{
		super( id );

		const listId	= this.element.getAttribute( 'list' );
		this.dataList	= document.getElementById( listId ) as HTMLDataListElement;

		if ( ! listId || ! this.dataList )
		{
			throw new Error(
				'DropdownDataList component must be instantiated with an Input element that has a corresponding list!'
			);
		}

		this.element.autocomplete	= 'off';
		this.element.type			= 'text';
	}

	public addListItem( value: string )
	{
		for ( const option of this.dataList.options )
		{
			if ( option.value === value )
			{
				return;
			}
		}

		const item = document.createElement( 'option' );
		item.value	= value;

		this.dataList.appendChild( item );
	}

	public getValue(): string
	{
		return this.element.value;
	}

	public setValue( value: string ): void
	{
		this.element.value	= value;
	}

	public destructor(){}
}
