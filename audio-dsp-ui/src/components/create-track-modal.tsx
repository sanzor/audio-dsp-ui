import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"

import type { AddTrackParams } from "@/Dtos/Tracks/AddTrackParams"
import type { CanonicalAudio } from "@/Audio/CanonicalAudio"
import type { ABuffer } from "@/Domain/ABuffer"

import { toAudioBuffer, interleave, encodeWav } from "@/Audio/Utils"

interface TrackCreateModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (track: AddTrackParams) => void
  canonicalAudio?: CanonicalAudio | null
}

export function TrackCreateModal({
  open,
  onClose,
  onSubmit,
  canonicalAudio,
}: TrackCreateModalProps) {
  const [trackName, setTrackName] = useState("")
  const [duration, setDuration] = useState(0)
  const [fileName, setFileName] = useState("")
  const [audioBufferPayload, setAudioBufferPayload] = useState<ABuffer | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleSubmit = () => {
    if (!audioBufferPayload) {
      console.error("Audio buffer not ready.")
      return
    }

    const addTrackParams: AddTrackParams = {
      rawTrack: {
        info: { name: trackName },
        data: audioBufferPayload,
      },
    }

    onSubmit(addTrackParams)
  }

  // Handle audio from recording (canonicalAudio)
  useEffect(() => {
    if (!canonicalAudio) return

    setTrackName("Untitled Recording")
    setFileName("Recorded Audio")
    setDuration(canonicalAudio.duration)

    const abuffer = toAudioBuffer(canonicalAudio)
    setAudioBufferPayload(abuffer)

    const interleaved = interleave(canonicalAudio.samples)
    const blob = encodeWav(interleaved, canonicalAudio.sampleRate, canonicalAudio.channels)
    const url = URL.createObjectURL(blob)

    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [canonicalAudio])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setTrackName(file.name.replace(/\.[^/.]+$/, ""))

    const arrayBuffer = await file.arrayBuffer()
    const audioCtx = new AudioContext()
    const buffer = await audioCtx.decodeAudioData(arrayBuffer)

    const canonical: CanonicalAudio = {
      samples: Array.from({ length: buffer.numberOfChannels }, (_, i) =>
        new Float32Array(buffer.getChannelData(i))
      ),
      sampleRate: buffer.sampleRate,
      channels: buffer.numberOfChannels,
      duration: buffer.duration,
    }

    const abuffer = toAudioBuffer(canonical)
    setAudioBufferPayload(abuffer)
    setDuration(buffer.duration)

    const interleaved = interleave(canonical.samples)
    const blob = encodeWav(interleaved, canonical.sampleRate, canonical.channels)
    const url = URL.createObjectURL(blob)

    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Track</DialogTitle>
          <DialogDescription>
            Provide a name and preview the audio before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Track Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="track-name" className="text-right text-sm font-medium">
              Name
            </label>
            <Input
              id="track-name"
              className="col-span-3"
              value={trackName}
              onChange={(e) => setTrackName(e.target.value)}
              placeholder="Enter track name"
            />
          </div>

          {/* File Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="file-name" className="text-right text-sm font-medium">
              File
            </label>
            <Input
              id="file-name"
              className="col-span-3"
              value={fileName}
              readOnly
              placeholder="No file selected"
            />
          </div>

          {/* Duration */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="track-duration" className="text-right text-sm font-medium">
              Duration
            </label>
            <Input
              id="track-duration"
              className="col-span-3"
              value={`${duration.toFixed(2)} sec`}
              readOnly
            />
          </div>

          {/* Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="audio-upload" className="text-right text-sm font-medium">
              Upload
            </label>
            <Input
              id="audio-upload"
              type="file"
              accept="audio/*"
              className="col-span-3"
              onChange={handleFileUpload}
            />
          </div>

          {/* Preview */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">Preview</label>
            <div className="col-span-3 border rounded h-20 bg-muted flex items-center justify-center text-muted-foreground text-sm">
              {previewUrl ? (
                <audio src={previewUrl} controls className="w-full" />
              ) : (
                <span>No preview available</span>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!audioBufferPayload}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
