import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, FileText, Trash2, RefreshCw, Plus, BookOpen, Upload } from "lucide-react"

interface Document {
  id: number
  title: string
  content: string
  doc_type: string
  created_at: string
}

export default function KnowledgeBasePage() {
  const { t, i18n } = useTranslation()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reindexing, setReindexing] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [docType, setDocType] = useState("markdown")
  const [showForm, setShowForm] = useState(false)
  const [creating, setCreating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchDocuments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await api.listDocuments()
      setDocuments(data as Document[])
    } catch (err) {
      setError(err instanceof Error ? err.message : t("knowledge.loadError"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDocuments() }, [])

  const handleCreate = async () => {
    if (!title || !content) return
    setCreating(true)
    try {
      await api.uploadDocument({ title, content, doc_type: docType })
      setTitle("")
      setContent("")
      setShowForm(false)
      await fetchDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("knowledge.createError"))
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: number) => {
    const doc = documents.find((d) => d.id === id)
    if (!window.confirm(t("knowledge.deleteConfirm", { title: doc?.title || String(id) }))) return
    try {
      await api.deleteDocument(id)
      setDocuments((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : t("knowledge.deleteError"))
    }
  }

  const handleReindex = async () => {
    setReindexing(true)
    try {
      await api.reindexDocuments()
    } catch (err) {
      setError(err instanceof Error ? err.message : t("knowledge.reindexError"))
    } finally {
      setReindexing(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result || "")
      setTitle(file.name.replace(/\.(txt|md|markdown)$/i, ""))
      setContent(text)
      setDocType(file.name.toLowerCase().endsWith(".txt") ? "txt" : "markdown")
      setShowForm(true)
    }
    reader.onerror = () => setError(t("knowledge.uploadError"))
    reader.readAsText(file)
    e.target.value = ""
  }

  if (loading && documents.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">{t("knowledge.title")}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReindex} disabled={reindexing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${reindexing ? "animate-spin" : ""}`} />
            {t("knowledge.reindex")}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.markdown"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            {t("knowledge.uploadFile")}
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            {t("knowledge.addDocument")}
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{t("knowledge.newDocument")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("knowledge.fieldTitle")}</label>
              <Input
                placeholder={t("knowledge.titlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("knowledge.type")}</label>
              <select
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm shadow-sm"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
              >
                <option value="markdown">Markdown</option>
                <option value="txt">TXT</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("knowledge.content")}</label>
              <textarea
                className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm"
                placeholder={t("knowledge.contentPlaceholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={creating || !title || !content}>
                {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("knowledge.save")}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>{t("knowledge.cancel")}</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <FileText className="h-12 w-12" />
            <p className="text-lg font-medium">{t("knowledge.noDocs")}</p>
            <p className="text-sm">{t("knowledge.noDocsHint")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="text-base">{doc.title}</CardTitle>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px]">{doc.doc_type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString(i18n.language)}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(doc.id)}
                  aria-label={t("knowledge.deleteDoc", { title: doc.title })}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {doc.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}