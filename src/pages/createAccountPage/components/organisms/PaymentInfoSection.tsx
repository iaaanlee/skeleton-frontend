import { UseFormRegister } from "react-hook-form";
import { FormSelect } from "../atoms/FormSelect";
import { CreateAccountRequest } from "../../../../types/account/request";

interface PaymentInfoSectionProps {
    register: UseFormRegister<CreateAccountRequest>;
}

export const PaymentInfoSection = ({ register }: PaymentInfoSectionProps) => {
    const paymentMethodOptions = [
        { value: "card", label: "Card" },
        { value: "bank", label: "Bank Transfer" },
        { value: "cash", label: "Cash" }
    ];

    return (
        <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Payment Information (Optional)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    register={register}
                    name="paymentInfo.paymentMethod"
                    options={paymentMethodOptions}
                    placeholder="Select payment method (optional)"
                    label="Payment Method"
                />
            </div>
        </div>
    );
}; 