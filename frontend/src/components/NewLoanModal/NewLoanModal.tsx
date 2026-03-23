import { useState } from "react";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { CREATE_LOAN } from "../../graphql/mutations";
import {
  CreateLoanMutation,
  CreateLoanMutationVariables,
  PaymentAllowed,
} from "../../graphql/generated/types";
import { GET_LOANS } from "../../graphql/queries";
import {
  Overlay,
  Modal,
  Title,
  Form,
  Field,
  Label,
  Input,
  Actions,
  CancelButton,
  SubmitButton,
} from "./NewLoanModal.styles";

interface NewLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewLoanModal = ({ isOpen, onClose }: NewLoanModalProps) => {
  const [name, setName] = useState("");
  const [principal, setPrincipal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentAllowed, setPaymentAllowed] = useState<PaymentAllowed>(
    PaymentAllowed.OnWorkDay,
  );

  const [createLoan, { loading }] = useMutation<
    CreateLoanMutation,
    CreateLoanMutationVariables
  >(CREATE_LOAN, {
    refetchQueries: [GET_LOANS],
  });

  const today = new Date().toISOString().split("T")[0];
  const endDateMin = startDate > today ? startDate : today;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createLoan({
        variables: {
          input: {
            name,
            principal: parseFloat(principal),
            startDate,
            endDate,
            paymentType: paymentAllowed,
          },
        },
      });
      toast.success("Loan created successfully");
      setName("");
      setPrincipal("");
      setStartDate("");
      setEndDate("");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create loan");
    }
  };

  const hadleSelectedPayment = (selectedPayment: PaymentAllowed) => {
    setPaymentAllowed(selectedPayment);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>
        <Title>New Loan</Title>
        <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Loan Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
          <Field>
            <Label>Principal Amount</Label>
            <Input
              type="number"
              value={principal}
              onChange={(event) => setPrincipal(event.target.value)}
              min="50"
              step="0.01"
              required
            />
          </Field>
          <Field>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              max={endDate}
              required
            />
          </Field>
          <Field>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(end) => setEndDate(end.target.value)}
              min={endDateMin}
              required
            />
          </Field>
          <Field>
            <Label>Payments on non workdays</Label>
            <select
              name="selectedPaymnetType"
              value={paymentAllowed}
              onChange={(event) =>
                hadleSelectedPayment(event.target.value as PaymentAllowed)
              }
            >
              <option value={PaymentAllowed.OnWorkDay}>Allowed</option>
              <option value={PaymentAllowed.Prev}>Move to prev work day</option>
              <option value={PaymentAllowed.Next}>Move to next work day</option>
            </select>
          </Field>
          <Actions>
            <CancelButton type="button" onClick={onClose}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Loan"}
            </SubmitButton>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default NewLoanModal;
