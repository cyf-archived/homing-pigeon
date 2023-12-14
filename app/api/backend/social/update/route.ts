import httpStatus from "http-status";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { userId } from "@/constants";
import { schema } from "@/schema/social";

// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const del_subtitle_ids = searchParams.getAll("del_subtitle_ids");
    const del_tip_ids = searchParams.getAll("del_tip_ids");
    const del_desc_ids = searchParams.getAll("del_desc_ids");
    const del_link_ids = searchParams.getAll("del_link_ids");
    const params = await request.json();
    const {
      error,
      value: { title, subtitles = [], tips = [], descriptions = [] },
    } = schema.validate(params);
    if (!id || error) {
      return NextResponse.json(
        {
          code: httpStatus.BAD_REQUEST,
          msg: "Bad request",
          timestamp: Date.now(),
        },
        { status: httpStatus.BAD_REQUEST },
      );
    }

    const social = await prisma.social.update({
      data: {
        title,
        subtitles: {
          updateMany: [
            ...(del_subtitle_ids.length
              ? [
                  {
                    data: {
                      update_by: userId,
                      update_date: new Date(),
                      is_del: "YES",
                    },
                    where: {
                      id: {
                        in: del_subtitle_ids,
                      },
                      is_del: "NO",
                    },
                  },
                ]
              : []),
            ...(subtitles
              .filter((subtitle: any) => !!subtitle.id)
              .map(
                ({
                  id,
                  title,
                  color,
                }: {
                  id: string;
                  title: string;
                  color?: string;
                }) => ({
                  data: {
                    title,
                    color,
                    update_by: userId,
                    update_date: new Date(),
                  },
                  where: {
                    id,
                    is_del: "NO",
                  },
                }),
              ) || []),
          ],
          createMany: {
            data: subtitles
              .filter((subtitle: any) => !subtitle.id)
              .map(({ title, color }: { title: string; color?: string }) => ({
                title,
                color,
                create_by: userId,
                update_by: userId,
              })),
          },
        },
        tips: {
          updateMany: [
            ...(del_tip_ids.length
              ? [
                  {
                    data: {
                      update_by: userId,
                      update_date: new Date(),
                      is_del: "YES",
                    },
                    where: {
                      id: {
                        in: del_tip_ids,
                      },
                      is_del: "NO",
                    },
                  },
                ]
              : []),
            ...(tips
              .filter((tip: any) => !!tip.id)
              .map(
                ({
                  id,
                  type,
                  text,
                  href,
                  color,
                }: {
                  id: string;
                  type: string;
                  text?: string;
                  href?: string;
                  color?: string;
                }) => ({
                  data: {
                    type,
                    text,
                    href,
                    color,
                    update_by: userId,
                    update_date: new Date(),
                  },
                  where: {
                    id,
                    is_del: "NO",
                  },
                }),
              ) || []),
          ],
          createMany: {
            data: tips
              .filter((tip: any) => !tip.id)
              .map(
                ({
                  type,
                  text,
                  href,
                  color,
                }: {
                  type: string;
                  text?: string;
                  href?: string;
                  color?: string;
                }) => ({
                  type,
                  text,
                  href,
                  color,
                  create_by: userId,
                  update_by: userId,
                }),
              ),
          },
        },
        descriptions: {
          updateMany: [
            ...(del_desc_ids.length
              ? [
                  {
                    data: {
                      update_by: userId,
                      update_date: new Date(),
                      is_del: "YES",
                    },
                    where: {
                      id: {
                        in: del_desc_ids,
                      },
                      is_del: "NO",
                    },
                  },
                ]
              : []),
            ...(descriptions
              .filter((description: any) => !!description.id)
              .map(
                ({
                  id,
                  name,
                  links,
                }: {
                  id: string;
                  name?: string;
                  links: Array<{
                    id?: string;
                    type: string;
                    text?: string;
                    href?: string;
                    color?: string;
                  }>;
                }) => ({
                  data: {
                    name,
                    links: {
                      updateMany: [
                        ...(del_link_ids.length
                          ? [
                              {
                                data: {
                                  update_by: userId,
                                  update_date: new Date(),
                                  is_del: "YES",
                                },
                                where: {
                                  id: {
                                    in: del_link_ids,
                                  },
                                  is_del: "NO",
                                },
                              },
                            ]
                          : []),
                        ...(links
                          .filter((link: any) => !!link.id)
                          .map(
                            ({
                              id,
                              type,
                              text,
                              href,
                              color,
                            }: {
                              id?: string;
                              type: string;
                              text?: string;
                              href?: string;
                              color?: string;
                            }) => ({
                              data: {
                                type,
                                text,
                                href,
                                color,
                                update_by: userId,
                                update_date: new Date(),
                              },
                              where: {
                                id,
                                is_del: "NO",
                              },
                            }),
                          ) || []),
                      ],
                      createMany: {
                        data: links
                          .filter((link: any) => !link.id)
                          .map(
                            ({
                              type,
                              text,
                              href,
                              color,
                            }: {
                              type: string;
                              text?: string;
                              href?: string;
                              color?: string;
                            }) => ({
                              type,
                              text,
                              href,
                              color,
                              create_by: userId,
                              update_by: userId,
                            }),
                          ),
                      },
                    },
                    update_by: userId,
                    update_date: new Date(),
                  },
                  where: {
                    id,
                    is_del: "NO",
                  },
                }),
              ) || []),
          ],
          createMany: {
            data: descriptions
              .filter((description: any) => !description.id)
              .map(
                ({
                  name,
                  links,
                }: {
                  name?: string;
                  links: Array<{
                    type: string;
                    text?: string;
                    href?: string;
                    color?: string;
                  }>;
                }) => ({
                  name,
                  links: {
                    // updateMany: {
                    //   data: {
                    //     update_by: userId,
                    //     update_date: new Date(),
                    //     is_del: "YES",
                    //   },
                    //   where: {
                    //     id: {
                    //       notIn: links
                    //         .filter((link: any) => !!link.id)
                    //         .map((link: any) => link.id),
                    //     },
                    //     is_del: "NO",
                    //   },
                    // },
                    createMany: {
                      data: links
                        .filter((link: any) => !link.id)
                        .map(
                          ({
                            type,
                            text,
                            href,
                            color,
                          }: {
                            type: string;
                            text?: string;
                            href?: string;
                            color?: string;
                          }) => ({
                            type,
                            text,
                            href,
                            color,
                            create_by: userId,
                            update_by: userId,
                          }),
                        ),
                    },
                  },
                  create_by: userId,
                  update_by: userId,
                }),
              ),
          },
        },
        update_by: userId,
        update_date: new Date(),
      },
      include: {
        subtitles: true,
        tips: true,
        descriptions: {
          include: {
            links: true,
          },
        },
      },
      where: {
        id,
        is_del: "NO",
      },
    });

    if (!social) {
      return NextResponse.json(
        { code: httpStatus.NOT_FOUND, msg: "Not Found", timestamp: Date.now() },
        { status: httpStatus.NOT_FOUND },
      );
    }

    return NextResponse.json(
      { code: 0, data: social, timestamp: Date.now() },
      { status: httpStatus.OK },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        code: httpStatus.INTERNAL_SERVER_ERROR,
        msg: error.message || error.toString(),
        timestamp: Date.now(),
      },
      { status: httpStatus.INTERNAL_SERVER_ERROR },
    );
  }
}
