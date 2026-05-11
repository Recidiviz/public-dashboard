import React from "react";
import { AutoHeightTransition } from "../UiLibrary";

type CustomNoteProps = {
  note: string;
};

export const CustomNote = ({note}: CustomNoteProps): JSX.Element => {
    return (
        <AutoHeightTransition>
            {note}
        </AutoHeightTransition>
    )
}