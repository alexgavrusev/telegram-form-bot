import { useState } from "react";
import type { FormObject } from "@telegram-form-bot/db";

import useForms from "hooks/use-forms";

const useSelectedForm = () => {
  const [selectedFormId, setSelectedFormId] = useState<
    FormObject["_id"] | null
  >(null);

  const { forms } = useForms();

  const form = forms.find((f) => f._id === selectedFormId);

  return [form, setSelectedFormId] as const;
};

export default useSelectedForm;
