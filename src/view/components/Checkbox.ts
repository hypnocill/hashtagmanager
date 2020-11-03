import Component from "@/services/component/Component";

export default class Checkbox extends Component<HTMLInputElement>
{
	onChange: ( event: Event ) => void;

	constructor( id: string | HTMLInputElement, onChange: ( newValue: boolean ) => void = () => {} )
	{
		super( id );
		this.element.type	= 'checkbox';

		this.onChange	= ( event: Event ) => onChange( this.getIsSelected() );
		this.element.addEventListener( 'change', this.onChange );
	}

	public getIsSelected(): boolean
	{
		return this.element.checked;
	}

	public check()
	{
		this.element.checked	= true;
	}

	public uncheck()
	{
		this.element.checked	= false;
	}

	public toggle()
	{
		this.element.checked	= ! this.element.checked;
	}

	public destructor(){}
}
