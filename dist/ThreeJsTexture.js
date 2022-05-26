/******************************************************************************
 * Spine Runtimes License Agreement
 * Last updated September 24, 2021. Replaces all prior versions.
 *
 * Copyright (c) 2013-2021, Esoteric Software LLC
 *
 * Integration of the Spine Runtimes into software or otherwise creating
 * derivative works of the Spine Runtimes is permitted under the terms and
 * conditions of Section 2 of the Spine Editor License Agreement:
 * http://esotericsoftware.com/spine-editor-license
 *
 * Otherwise, it is permitted to integrate the Spine Runtimes into software
 * or otherwise create derivative works of the Spine Runtimes (collectively,
 * "Products"), provided that each user of the Products must obtain their own
 * Spine Editor license and redistribution of the Products in any form must
 * include this license and copyright notice.
 *
 * THE SPINE RUNTIMES ARE PROVIDED BY ESOTERIC SOFTWARE LLC "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL ESOTERIC SOFTWARE LLC BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES,
 * BUSINESS INTERRUPTION, OR LOSS OF USE, DATA, OR PROFITS) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THE SPINE RUNTIMES, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *****************************************************************************/
import { BlendMode, Texture, TextureFilter, TextureWrap } from "@esotericsoftware/spine-core";
import * as THREE from "three";
export class ThreeJsTexture extends Texture {
    constructor(image) {
        super(image);
        if (image instanceof ImageBitmap)
            throw new Error("ImageBitmap not supported.");
        this.texture = new THREE.Texture(image);
        this.texture.flipY = false;
        this.texture.needsUpdate = true;
    }
    setFilters(minFilter, magFilter) {
        this.texture.minFilter = ThreeJsTexture.toThreeJsTextureFilter(minFilter);
        this.texture.magFilter = ThreeJsTexture.toThreeJsTextureFilter(magFilter);
    }
    setWraps(uWrap, vWrap) {
        this.texture.wrapS = ThreeJsTexture.toThreeJsTextureWrap(uWrap);
        this.texture.wrapT = ThreeJsTexture.toThreeJsTextureWrap(vWrap);
    }
    dispose() {
        this.texture.dispose();
    }
    static toThreeJsTextureFilter(filter) {
        if (filter === TextureFilter.Linear)
            return THREE.LinearFilter;
        else if (filter === TextureFilter.MipMap)
            return THREE.LinearMipMapLinearFilter; // also includes TextureFilter.MipMapLinearLinear
        else if (filter === TextureFilter.MipMapLinearNearest)
            return THREE.LinearMipMapNearestFilter;
        else if (filter === TextureFilter.MipMapNearestLinear)
            return THREE.NearestMipMapLinearFilter;
        else if (filter === TextureFilter.MipMapNearestNearest)
            return THREE.NearestMipMapNearestFilter;
        else if (filter === TextureFilter.Nearest)
            return THREE.NearestFilter;
        else
            throw new Error("Unknown texture filter: " + filter);
    }
    static toThreeJsTextureWrap(wrap) {
        if (wrap === TextureWrap.ClampToEdge)
            return THREE.ClampToEdgeWrapping;
        else if (wrap === TextureWrap.MirroredRepeat)
            return THREE.MirroredRepeatWrapping;
        else if (wrap === TextureWrap.Repeat)
            return THREE.RepeatWrapping;
        else
            throw new Error("Unknown texture wrap: " + wrap);
    }
    static toThreeJsBlending(blend) {
        if (blend === BlendMode.Normal)
            return THREE.NormalBlending;
        else if (blend === BlendMode.Additive)
            return THREE.AdditiveBlending;
        else if (blend === BlendMode.Multiply)
            return THREE.MultiplyBlending;
        else if (blend === BlendMode.Screen)
            return THREE.CustomBlending;
        else
            throw new Error("Unknown blendMode: " + blend);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGhyZWVKc1RleHR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvVGhyZWVKc1RleHR1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsrRUEyQitFO0FBRS9FLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM5RixPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUUvQixNQUFNLE9BQU8sY0FBZSxTQUFRLE9BQU87SUFHMUMsWUFBYSxLQUFxQztRQUNqRCxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDYixJQUFJLEtBQUssWUFBWSxXQUFXO1lBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO1FBQ2hGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7SUFDakMsQ0FBQztJQUVELFVBQVUsQ0FBRSxTQUF3QixFQUFFLFNBQXdCO1FBQzdELElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxRSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsc0JBQXNCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELFFBQVEsQ0FBRSxLQUFrQixFQUFFLEtBQWtCO1FBQy9DLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELE9BQU87UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3hCLENBQUM7SUFFRCxNQUFNLENBQUMsc0JBQXNCLENBQUUsTUFBcUI7UUFDbkQsSUFBSSxNQUFNLEtBQUssYUFBYSxDQUFDLE1BQU07WUFBRSxPQUFPLEtBQUssQ0FBQyxZQUFZLENBQUM7YUFDMUQsSUFBSSxNQUFNLEtBQUssYUFBYSxDQUFDLE1BQU07WUFBRSxPQUFPLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLGlEQUFpRDthQUM3SCxJQUFJLE1BQU0sS0FBSyxhQUFhLENBQUMsbUJBQW1CO1lBQUUsT0FBTyxLQUFLLENBQUMseUJBQXlCLENBQUM7YUFDekYsSUFBSSxNQUFNLEtBQUssYUFBYSxDQUFDLG1CQUFtQjtZQUFFLE9BQU8sS0FBSyxDQUFDLHlCQUF5QixDQUFDO2FBQ3pGLElBQUksTUFBTSxLQUFLLGFBQWEsQ0FBQyxvQkFBb0I7WUFBRSxPQUFPLEtBQUssQ0FBQywwQkFBMEIsQ0FBQzthQUMzRixJQUFJLE1BQU0sS0FBSyxhQUFhLENBQUMsT0FBTztZQUFFLE9BQU8sS0FBSyxDQUFDLGFBQWEsQ0FBQzs7WUFDakUsTUFBTSxJQUFJLEtBQUssQ0FBQywwQkFBMEIsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsTUFBTSxDQUFDLG9CQUFvQixDQUFFLElBQWlCO1FBQzdDLElBQUksSUFBSSxLQUFLLFdBQVcsQ0FBQyxXQUFXO1lBQUUsT0FBTyxLQUFLLENBQUMsbUJBQW1CLENBQUM7YUFDbEUsSUFBSSxJQUFJLEtBQUssV0FBVyxDQUFDLGNBQWM7WUFBRSxPQUFPLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQzthQUM3RSxJQUFJLElBQUksS0FBSyxXQUFXLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQzs7WUFDN0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx3QkFBd0IsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsTUFBTSxDQUFDLGlCQUFpQixDQUFFLEtBQWdCO1FBQ3pDLElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxNQUFNO1lBQUUsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDO2FBQ3ZELElBQUksS0FBSyxLQUFLLFNBQVMsQ0FBQyxRQUFRO1lBQUUsT0FBTyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7YUFDaEUsSUFBSSxLQUFLLEtBQUssU0FBUyxDQUFDLFFBQVE7WUFBRSxPQUFPLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQzthQUNoRSxJQUFJLEtBQUssS0FBSyxTQUFTLENBQUMsTUFBTTtZQUFFLE9BQU8sS0FBSyxDQUFDLGNBQWMsQ0FBQzs7WUFDNUQsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0QifQ==