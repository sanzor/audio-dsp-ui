# Details

Date : 2025-09-18 19:44:25

Directory /home/sanzor/audio-dsp-ui/audio-dsp-ui

Total : 119 files,  8063 codes, 169 comments, 1410 blanks, all 9642 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [README.md](/README.md) | Markdown | 58 | 0 | 12 | 70 |
| [components.json](/components.json) | JSON | 21 | 0 | 0 | 21 |
| [eslint.config.js](/eslint.config.js) | JavaScript | 22 | 0 | 2 | 24 |
| [index.html](/index.html) | HTML | 14 | 0 | 1 | 15 |
| [package.json](/package.json) | JSON | 54 | 0 | 1 | 55 |
| [pnpm-lock.yaml](/pnpm-lock.yaml) | YAML | 2,919 | 0 | 692 | 3,611 |
| [public/vite.svg](/public/vite.svg) | XML | 1 | 0 | 0 | 1 |
| [src/Adapters/CommandAdapter.ts](/src/Adapters/CommandAdapter.ts) | TypeScript | 76 | 0 | 18 | 94 |
| [src/App.css](/src/App.css) | PostCSS | 37 | 0 | 6 | 43 |
| [src/App.tsx](/src/App.tsx) | TypeScript JSX | 55 | 10 | 16 | 81 |
| [src/Audio/CanonicalAudio.ts](/src/Audio/CanonicalAudio.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [src/Audio/Utils.ts](/src/Audio/Utils.ts) | TypeScript | 75 | 3 | 15 | 93 |
| [src/Auth/AuthCallback.tsx](/src/Auth/AuthCallback.tsx) | TypeScript JSX | 16 | 0 | 4 | 20 |
| [src/Auth/AuthContext.tsx](/src/Auth/AuthContext.tsx) | TypeScript JSX | 80 | 12 | 14 | 106 |
| [src/Auth/AuthListener.tsx](/src/Auth/AuthListener.tsx) | TypeScript JSX | 18 | 5 | 7 | 30 |
| [src/Auth/AuthTypes.ts](/src/Auth/AuthTypes.ts) | TypeScript | 17 | 0 | 1 | 18 |
| [src/Auth/UseAuth.ts](/src/Auth/UseAuth.ts) | TypeScript | 9 | 0 | 4 | 13 |
| [src/Auth/UseAuthAutoRefreshOptions.tsx](/src/Auth/UseAuthAutoRefreshOptions.tsx) | TypeScript JSX | 67 | 23 | 7 | 97 |
| [src/Constants.ts](/src/Constants.ts) | TypeScript | 10 | 0 | 9 | 19 |
| [src/Domain/ABuffer.ts](/src/Domain/ABuffer.ts) | TypeScript | 5 | 0 | 0 | 5 |
| [src/Domain/Commands/Command.ts](/src/Domain/Commands/Command.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Domain/Commands/PauseCommand.ts](/src/Domain/Commands/PauseCommand.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/Domain/Commands/PlayCommand.ts](/src/Domain/Commands/PlayCommand.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/Domain/Commands/SeekCommand.ts](/src/Domain/Commands/SeekCommand.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/Domain/Commands/StopCommand.ts](/src/Domain/Commands/StopCommand.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/Domain/TrackInfo.ts](/src/Domain/TrackInfo.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/Domain/TrackMeta.ts](/src/Domain/TrackMeta.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/Domain/TrackMetaWithRegions.ts](/src/Domain/TrackMetaWithRegions.ts) | TypeScript | 5 | 0 | 3 | 8 |
| [src/Domain/TrackRegion.ts](/src/Domain/TrackRegion.ts) | TypeScript | 7 | 0 | 0 | 7 |
| [src/Domain/User.ts](/src/Domain/User.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [src/Dtos/Regions/CreateRegionParams.ts](/src/Dtos/Regions/CreateRegionParams.ts) | TypeScript | 6 | 0 | 0 | 6 |
| [src/Dtos/Regions/CreateRegionResult.ts](/src/Dtos/Regions/CreateRegionResult.ts) | TypeScript | 7 | 0 | 0 | 7 |
| [src/Dtos/Regions/EditRegionParams.ts](/src/Dtos/Regions/EditRegionParams.ts) | TypeScript | 7 | 0 | 0 | 7 |
| [src/Dtos/Regions/EditRegionResult.ts](/src/Dtos/Regions/EditRegionResult.ts) | TypeScript | 7 | 0 | 0 | 7 |
| [src/Dtos/Regions/RemoveRegionParams.ts](/src/Dtos/Regions/RemoveRegionParams.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Regions/RemoveRegionResult.ts](/src/Dtos/Regions/RemoveRegionResult.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/SocketCommandResults/BaseCommandResultDto.ts](/src/Dtos/SocketCommandResults/BaseCommandResultDto.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/SocketCommandResults/PauseCommandResultDto copy.ts](/src/Dtos/SocketCommandResults/PauseCommandResultDto%20copy.ts) | TypeScript | 5 | 0 | 4 | 9 |
| [src/Dtos/SocketCommandResults/PlayCommandResultDto copy.ts](/src/Dtos/SocketCommandResults/PlayCommandResultDto%20copy.ts) | TypeScript | 5 | 0 | 4 | 9 |
| [src/Dtos/SocketCommandResults/SeekCommandResultDto.ts](/src/Dtos/SocketCommandResults/SeekCommandResultDto.ts) | TypeScript | 5 | 0 | 4 | 9 |
| [src/Dtos/SocketCommandResults/StopCommandResultDto.ts](/src/Dtos/SocketCommandResults/StopCommandResultDto.ts) | TypeScript | 5 | 0 | 4 | 9 |
| [src/Dtos/SocketCommands/BaseCommandDto.ts](/src/Dtos/SocketCommands/BaseCommandDto.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/SocketCommands/PauseCommandDto.ts](/src/Dtos/SocketCommands/PauseCommandDto.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/Dtos/SocketCommands/PlayCommandDto.ts](/src/Dtos/SocketCommands/PlayCommandDto.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/Dtos/SocketCommands/SeekCommandDto.ts](/src/Dtos/SocketCommands/SeekCommandDto.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/Dtos/SocketCommands/StopCommandDto.ts](/src/Dtos/SocketCommands/StopCommandDto.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [src/Dtos/Tracks/AddTrackParams.ts](/src/Dtos/Tracks/AddTrackParams.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [src/Dtos/Tracks/AddTrackResult.ts](/src/Dtos/Tracks/AddTrackResult.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Tracks/CopyTrackParams.ts](/src/Dtos/Tracks/CopyTrackParams.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/Dtos/Tracks/CopyTrackResult.ts](/src/Dtos/Tracks/CopyTrackResult.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Tracks/GetTrackParams.ts](/src/Dtos/Tracks/GetTrackParams.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Tracks/GetTrackRawParams.ts](/src/Dtos/Tracks/GetTrackRawParams.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Tracks/GetTrackRawResult.ts](/src/Dtos/Tracks/GetTrackRawResult.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/Dtos/Tracks/GetTrackResult.ts](/src/Dtos/Tracks/GetTrackResult.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/Dtos/Tracks/RawTrack.ts](/src/Dtos/Tracks/RawTrack.ts) | TypeScript | 6 | 0 | 1 | 7 |
| [src/Dtos/Tracks/RemoveTrackParams.ts](/src/Dtos/Tracks/RemoveTrackParams.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Tracks/RemoveTrackResult.ts](/src/Dtos/Tracks/RemoveTrackResult.ts) | TypeScript | 3 | 0 | 0 | 3 |
| [src/Dtos/Tracks/UpdateTrackParams.ts](/src/Dtos/Tracks/UpdateTrackParams.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/Dtos/Tracks/UpdateTrackResult.ts](/src/Dtos/Tracks/UpdateTrackResult.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/EventBus.ts](/src/EventBus.ts) | TypeScript | 28 | 0 | 7 | 35 |
| [src/Events.ts](/src/Events.ts) | TypeScript | 18 | 1 | 6 | 25 |
| [src/Providers/AudioPlaybackCacheContext.tsx](/src/Providers/AudioPlaybackCacheContext.tsx) | TypeScript JSX | 28 | 1 | 7 | 36 |
| [src/Providers/EventBusContext.tsx](/src/Providers/EventBusContext.tsx) | TypeScript JSX | 19 | 5 | 4 | 28 |
| [src/Providers/SelectedTrackContext.tsx](/src/Providers/SelectedTrackContext.tsx) | TypeScript JSX | 29 | 1 | 7 | 37 |
| [src/Providers/TracksContext.tsx](/src/Providers/TracksContext.tsx) | TypeScript JSX | 75 | 10 | 9 | 94 |
| [src/Providers/UsePlaybackCache.tsx](/src/Providers/UsePlaybackCache.tsx) | TypeScript JSX | 9 | 0 | 1 | 10 |
| [src/Providers/UseSelectedTrack.tsx](/src/Providers/UseSelectedTrack.tsx) | TypeScript JSX | 9 | 0 | 2 | 11 |
| [src/Providers/UseTracks.ts](/src/Providers/UseTracks.ts) | TypeScript | 7 | 0 | 3 | 10 |
| [src/Services/AuthService.ts](/src/Services/AuthService.ts) | TypeScript | 40 | 19 | 13 | 72 |
| [src/Services/RegionsService.ts](/src/Services/RegionsService.ts) | TypeScript | 58 | 0 | 9 | 67 |
| [src/Services/TracksService.ts](/src/Services/TracksService.ts) | TypeScript | 132 | 9 | 29 | 170 |
| [src/Utils/AudioUtils.ts](/src/Utils/AudioUtils.ts) | TypeScript | 4 | 0 | 0 | 4 |
| [src/Websocket/MessageService.ts](/src/Websocket/MessageService.ts) | TypeScript | 47 | 5 | 22 | 74 |
| [src/Websocket/Websocket.ts](/src/Websocket/Websocket.ts) | TypeScript | 34 | 17 | 6 | 57 |
| [src/Websocket/WebsocketController.ts](/src/Websocket/WebsocketController.ts) | TypeScript | 125 | 0 | 26 | 151 |
| [src/assets/react.svg](/src/assets/react.svg) | XML | 1 | 0 | 0 | 1 |
| [src/components/app-sidebar.tsx](/src/components/app-sidebar.tsx) | TypeScript JSX | 150 | 3 | 11 | 164 |
| [src/components/copy-track-modal.tsx](/src/components/copy-track-modal.tsx) | TypeScript JSX | 47 | 0 | 9 | 56 |
| [src/components/create-track-modal.tsx](/src/components/create-track-modal.tsx) | TypeScript JSX | 170 | 7 | 26 | 203 |
| [src/components/dashboard.tsx](/src/components/dashboard.tsx) | TypeScript JSX | 231 | 11 | 46 | 288 |
| [src/components/details-track-modal.tsx](/src/components/details-track-modal.tsx) | TypeScript JSX | 78 | 1 | 10 | 89 |
| [src/components/login-form.tsx](/src/components/login-form.tsx) | TypeScript JSX | 60 | 0 | 3 | 63 |
| [src/components/nav-main.tsx](/src/components/nav-main.tsx) | TypeScript JSX | 107 | 0 | 9 | 116 |
| [src/components/nav-projects.tsx](/src/components/nav-projects.tsx) | TypeScript JSX | 54 | 0 | 6 | 60 |
| [src/components/nav-user.tsx](/src/components/nav-user.tsx) | TypeScript JSX | 110 | 0 | 5 | 115 |
| [src/components/rename-track-modal.tsx](/src/components/rename-track-modal.tsx) | TypeScript JSX | 48 | 0 | 9 | 57 |
| [src/components/team-switcher.tsx](/src/components/team-switcher.tsx) | TypeScript JSX | 85 | 0 | 5 | 90 |
| [src/components/track-context-menu.tsx](/src/components/track-context-menu.tsx) | TypeScript JSX | 29 | 0 | 2 | 31 |
| [src/components/ui/avatar.tsx](/src/components/ui/avatar.tsx) | TypeScript JSX | 47 | 0 | 7 | 54 |
| [src/components/ui/breadcrumb.tsx](/src/components/ui/breadcrumb.tsx) | TypeScript JSX | 99 | 0 | 11 | 110 |
| [src/components/ui/button.tsx](/src/components/ui/button.tsx) | TypeScript JSX | 54 | 1 | 6 | 61 |
| [src/components/ui/card.tsx](/src/components/ui/card.tsx) | TypeScript JSX | 83 | 0 | 10 | 93 |
| [src/components/ui/collapsible.tsx](/src/components/ui/collapsible.tsx) | TypeScript JSX | 28 | 0 | 6 | 34 |
| [src/components/ui/context-menu.tsx](/src/components/ui/context-menu.tsx) | TypeScript JSX | 233 | 0 | 18 | 251 |
| [src/components/ui/dialog.tsx](/src/components/ui/dialog.tsx) | TypeScript JSX | 129 | 0 | 13 | 142 |
| [src/components/ui/dropdown-menu.tsx](/src/components/ui/dropdown-menu.tsx) | TypeScript JSX | 238 | 0 | 18 | 256 |
| [src/components/ui/input.tsx](/src/components/ui/input.tsx) | TypeScript JSX | 18 | 0 | 4 | 22 |
| [src/components/ui/label.tsx](/src/components/ui/label.tsx) | TypeScript JSX | 19 | 0 | 4 | 23 |
| [src/components/ui/separator.tsx](/src/components/ui/separator.tsx) | TypeScript JSX | 23 | 0 | 4 | 27 |
| [src/components/ui/sheet.tsx](/src/components/ui/sheet.tsx) | TypeScript JSX | 126 | 0 | 14 | 140 |
| [src/components/ui/sidebar-context-props.ts](/src/components/ui/sidebar-context-props.ts) | TypeScript | 9 | 0 | 1 | 10 |
| [src/components/ui/sidebar-context.tsx](/src/components/ui/sidebar-context.tsx) | TypeScript JSX | 12 | 1 | 3 | 16 |
| [src/components/ui/sidebar-provider.tsx](/src/components/ui/sidebar-provider.tsx) | TypeScript JSX | 94 | 7 | 11 | 112 |
| [src/components/ui/sidebar.tsx](/src/components/ui/sidebar.tsx) | TypeScript JSX | 553 | 5 | 42 | 600 |
| [src/components/ui/skeleton.tsx](/src/components/ui/skeleton.tsx) | TypeScript JSX | 11 | 0 | 3 | 14 |
| [src/components/ui/table.tsx](/src/components/ui/table.tsx) | TypeScript JSX | 104 | 0 | 11 | 115 |
| [src/components/ui/tooltip.tsx](/src/components/ui/tooltip.tsx) | TypeScript JSX | 53 | 0 | 7 | 60 |
| [src/components/ui/use-sidebar.ts](/src/components/ui/use-sidebar.ts) | TypeScript | 13 | 0 | 7 | 20 |
| [src/components/wave-region-context-menu.tsx](/src/components/wave-region-context-menu.tsx) | TypeScript JSX | 23 | 0 | 2 | 25 |
| [src/components/waveform-player.tsx](/src/components/waveform-player.tsx) | TypeScript JSX | 233 | 6 | 40 | 279 |
| [src/hooks/use-mobile.ts](/src/hooks/use-mobile.ts) | TypeScript | 15 | 0 | 5 | 20 |
| [src/index.css](/src/index.css) | PostCSS | 173 | 0 | 12 | 185 |
| [src/lib/utils.ts](/src/lib/utils.ts) | TypeScript | 5 | 0 | 2 | 7 |
| [src/main.tsx](/src/main.tsx) | TypeScript JSX | 18 | 0 | 4 | 22 |
| [src/vite-env.d.ts](/src/vite-env.d.ts) | TypeScript | 0 | 1 | 1 | 2 |
| [tsconfig.app.json](/tsconfig.app.json) | JSON | 29 | 2 | 3 | 34 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 16 | 0 | 1 | 17 |
| [tsconfig.node.json](/tsconfig.node.json) | JSON | 21 | 2 | 3 | 26 |
| [vite.config.ts](/vite.config.ts) | TypeScript | 15 | 1 | 2 | 18 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)