import { ConsumerFooter } from "@/components/layout/Footer"
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation"
import { FadeInItem } from "@/components/layout/PageFadeIn"
import { DocumentOrganizerContent } from "@/components/documents/DocumentOrganizerContent"
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground"

export default function DocumentOrganizerPage() {
  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />
      <FadeInItem>
        <div className="mx-auto max-w-[1440px] px-8 py-8">
          <DocumentOrganizerContent />
        </div>
      </FadeInItem>
      <ConsumerFooter />
    </div>
  )
}
