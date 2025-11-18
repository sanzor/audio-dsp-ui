export type PasteGraphParams={
  source:SourcePasteGraphParams,
  destination:DestinationPasteGraphParams
}
type SourcePasteGraphParams={
  trackId:string,
  regionSetId:string,
  regionId:string,
  graphId:string
}
type DestinationPasteGraphParams={
  trackId:string,
  regionSetId:string,
  regionId:string
}

export type PasteRegionParams={
  source:SourcePasteRegionParams,
  destination:DestinationPasteRegionParams
}
type SourcePasteRegionParams={
  trackId:string,
  regionSetId:string,
  regionId:string
}
type DestinationPasteRegionParams={
  trackId:string,
  regionSetId:string
}

export type PasteRegionSetParams={
  source:SourcePasteRegionSetParams,
  destination:DestinationPasteRegionSetParams
}

type SourcePasteRegionSetParams={
  trackId:string,
  regionSetId:string,
}
type DestinationPasteRegionSetParams={
  trackId:string,
}