import Component from "@/services/component/Component";

export default class TextInput extends Component<HTMLInputElement>
{
	defaultPlaceholder: string;
	onBlur: ( event: Event ) => void;
	onFocus: ( event: Event ) => void;

	constructor( id: string )
	{
		super( id );
		this.defaultPlaceholder	= this.element.getAttribute( 'placeholder' );
		this.onBlur				= this.blur.bind( this );
		this.onFocus			= this.focus.bind( this );

		this.element.autocomplete	= 'off';
		this.element.type			= 'text';

		this.element.addEventListener( 'blur', this.onBlur );
		this.element.addEventListener( 'focus', this.onFocus );
	}

	public destructor()
	{
		this.element.removeEventListener( 'blur', this.onBlur );
		this.element.removeEventListener( 'focus', this.onFocus );
	}

	public getValue(): string
	{
		return this.element.value;
	}

	public setValue( value: string ): void
	{
		this.element.value	= value;
	}

	////////////////////////////////////////////////////////////////////////////////////////////////

	private blur( event: Event )
	{
		( this.element as HTMLInputElement ).placeholder	= this.defaultPlaceholder;
	}

	private focus( event: Event )
	{
		( this.element as HTMLInputElement ).placeholder	= '';
	}
}
