import Component from "@/services/component/Component";
import TextInput from "./TextInput";

export default class NumberInput extends TextInput
{
	onChange: ( event: Event ) => void;

	constructor( id: string, onChange: ( newValue: number ) => void = () => {} )
	{
		super( id );
		this.element.type	= 'number';

		this.onChange	= ( event: Event ) => onChange( this.getValueAsNumber() );
		this.element.addEventListener( 'change', this.onChange );
	}

	public getValueAsNumber(): number
	{
		return Number( this.element.value );
	}

	public destructor()
	{
		super.destructor();
		this.element.removeEventListener( 'blur', this.onChange );
	}
}
