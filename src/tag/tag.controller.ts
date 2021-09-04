import { Controller, Get } from "@nestjs/common"
import { map, prop } from "ramda"

import { TagService } from "./tag.service"

@Controller("tags")
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const tagsEntity = await this.tagService.findAll()

    return { tags: map(prop("name"))(tagsEntity) }
  }
}
