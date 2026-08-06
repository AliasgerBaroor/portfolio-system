import { Card } from "@workspace/ui/components/card";
import { Section } from "../types";

interface SectionCardProps {
  section: Section;
}

export default function SectionCard({
    section
}: SectionCardProps){

    return(

        <Card>

            {section.title}

        </Card>

    )

}