import { useParams } from "react-router-dom"
import { ConsumerFooter } from "@/components/layout/Footer"
import { ConsumerNavigation } from "@/components/layout/ConsumerNavigation"
import { FadeInItem } from "@/components/layout/PageFadeIn"
import { DocumentFolderContent } from "@/components/documents/DocumentFolderContent"
import { consumerPageBackgroundStyle } from "@/constants/consumerPageBackground"

export default function DocumentFolderPage() {
  const { folderId } = useParams<{ folderId: string }>()

  return (
    <div className="min-h-screen" style={consumerPageBackgroundStyle}>
      <ConsumerNavigation />
      <FadeInItem>
        <div className="mx-auto max-w-[1440px] px-8 py-8">
          <DocumentFolderContent folderId={folderId ?? ""} />
        </div>
      </FadeInItem>
      <ConsumerFooter />
    </div>
  )
}
