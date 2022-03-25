# src/StarterGUI

This is the StarterGUI service when using Rojo. Put any UIs you want to use in development here as rbxmxes.

Note that these **WON'T** be bundled automatically; you'll needa do that manually.

## Source

You should put your source in the [/src/StarterGUI/Scripts/Main](Scripts/Main/) directory. The Index file is [/src/StarterGUI/Scripts/Main/init.lua](Scripts/Main/init.lua).

[/src/StarterGUI/Scripts/Main/start.client.lua](Scripts/Main/start.client.lua) runs on client start, and is meant to load the modulescript, for ease of use in studio. It, like all other `.client.lua` files, **won't** be bundled.

## License

Copyright (C) 2022 YieldingCoder

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received [a copy of the GNU Affero General Public License](./LICENSE.md)
along with this program. If not, see <https://www.gnu.org/licenses/>.
