import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { requireAuthOrNull } from "@/lib/auth";
import { Prisma } from "@prisma/client";
import { createBorrowingSchema } from "@/lib/validation/borrowings";

export async function GET(request: NextRequest) {
  try {
    const userAccess = await requireAuthOrNull();
    if (userAccess instanceof NextResponse) return userAccess;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination params" },
        { status: 400 }
      );
    }
    const search = searchParams.get("search") || "";
    const filterStatus = searchParams.get("status") || "";
    const filterUserRole = searchParams.get("userRole") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.BorrowingWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  borrower: {
                    username: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  borrower: {
                    email: { contains: search, mode: "insensitive" },
                  },
                },
                {
                  items: {
                    some: {
                      chemical: {
                        name: { contains: search, mode: "insensitive" },
                      },
                    },
                  },
                },
              ],
            }
          : null,
        filterStatus
          ? { filterStatus: { contains: filterStatus, mode: "insensitive" } }
          : null,
        filterUserRole
          ? {
              filterUserRole: { contains: filterUserRole, mode: "insensitive" },
            }
          : null,
      ].filter(Boolean) as Prisma.BorrowingWhereInput[],
    };

    const [
      borrowings,
      totalFiltered,
      total,
      recentActivities,
      allActive,
      ownActive,
    ] = await Promise.all([
      db.borrowing.findMany({
        where,
        include: {
          borrower: {
            include: {
              dosen: { select: { full_name: true } },
              laboran: { select: { full_name: true } },
              mahasiswa: { select: { full_name: true } },
            },
          },
          items: {
            select: {
              id: true,
              chemicalId: true,
              quantity: true,
              returned: true,
              returnedQty: true,
              chemical: {
                select: { id: true, name: true, formula: true, unit: true },
              },
            },
          },
          approvedBy: {
            include: {
              admin: { select: { pin: true } },
              laboran: { select: { nip: true, full_name: true } },
            },
          },
          rejectedBy: {
            include: {
              admin: { select: { pin: true } },
              laboran: { select: { nip: true, full_name: true } },
            },
          },
          returnedBy: {
            include: {
              admin: { select: { pin: true } },
              laboran: { select: { nip: true, full_name: true } },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { requestDate: "desc" },
      }),

      // Menghitung total data yang sesuai
      db.borrowing.count({ where }),
      // total semua data
      db.borrowing.count(),

      // Mengambil 5 aktivitas terbaru
      db.borrowing.findMany({
        take: 5,
        orderBy: { requestDate: "desc" },
        include: {
          borrower: { select: { username: true } },
          items: {
            select: {
              chemical: { select: { name: true, unit: true } },
            },
          },
        },
      }),

      // Menghitung jumlah peminjaman aktif
      db.borrowing.count({
        where: {
          status: { in: ["APPROVED", "OVERDUE"] },
        },
      }),

      db.borrowing.count({
        where: {
          status: { in: ["APPROVED", "OVERDUE"] },
          borrowerId: userAccess?.userId,
        },
      }),
    ]);

    const formattedBorrowings = borrowings.map((borrowing) => {
      let approvedByName = undefined;
      let rejectedByName = undefined;
      let returnedByName = undefined;
      let name = undefined;
      switch (borrowing.borrower.role) {
        case "ADMIN":
          approvedByName = "Administrator";
          rejectedByName = "Administrator";
          returnedByName = "Administrator";
          name = "Administrator";
          break;
        case "LABORAN":
          approvedByName = borrowing.approvedBy?.laboran?.full_name;
          rejectedByName = borrowing.rejectedBy?.laboran?.full_name;
          returnedByName = borrowing.returnedBy?.laboran?.full_name;

          name = borrowing.borrower.laboran?.full_name;
          break;
        case "DOSEN":
          name = borrowing.borrower.dosen?.full_name;
          break;
        case "MAHASISWA":
          name = borrowing.borrower.mahasiswa?.full_name;
          break;
        default:
          name = "GUEST";
          break;
      }

      return {
        id: borrowing.id,
        borrowerId: borrowing.borrowerId,
        borrower: {
          id: borrowing.borrower.id,
          name: name,
          email: borrowing.borrower.email,
          role: borrowing.borrower.role,
        },
        purpose: borrowing.purpose,
        status: borrowing.status,
        requestDate: borrowing.requestDate.toISOString().split("T")[0],
        approvedAt: borrowing.approvedAt
          ? borrowing.approvedAt.toISOString().split("T")[0]
          : null,
        returnedAt: borrowing.returnedAt
          ? borrowing.returnedAt.toISOString().split("T")[0]
          : null,
        notes: borrowing.notes,
        items: borrowing.items.map((item) => ({
          id: item.id,
          chemicalId: item.chemicalId,
          chemical: {
            id: item.chemical.id,
            name: item.chemical.name,
            formula: item.chemical.formula,
            unit: item.chemical.unit,
          },
          quantity: item.quantity,
          returned: item.returned,
          returnedQty: item.returnedQty,
        })),
        approvedBy: {
          userId: borrowing.approvedBy?.id,
          name: approvedByName,
        },
        rejectedBy: {
          userId: borrowing.rejectedBy?.id,
          name: rejectedByName,
        },
        returnedBy: {
          userId: borrowing.returnedBy?.id,
          name: returnedByName,
        },
      };
    });

    return NextResponse.json(
      {
        message: "Successfully fetched borrowings",
        borrowings: borrowings,
        formattedBorrowings,
        totalFiltered,
        recentActivities,
        allActive,
        ownActive,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching borrowings: ", error);
    return NextResponse.json(
      { error: "Failed to fetch borrowings" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userAccess = await requireAuthOrNull();
    if (userAccess instanceof NextResponse) return userAccess;

    const body = await req.json();
    const parsed = createBorrowingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { errors: "Data tidak valid", issues: parsed.error.issues },
        { status: 400 }
      );
    }

    const { purpose, notes, items } = parsed.data;

    const borrowing = await db.borrowing.create({
      data: {
        purpose,
        notes,
        borrowerId: userAccess.userId,
        items: {
          create: items.map((item) => ({
            chemicalId: item.chemicalId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        borrower: {
          include: {
            laboran: { select: { full_name: true } },
            dosen: { select: { full_name: true } },
            mahasiswa: { select: { full_name: true } },
          },
        },
        items: {
          include: {
            chemical: {
              select: { id: true, name: true, formula: true, unit: true },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "Borrowing created successfully", borrowing },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating borrowing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
