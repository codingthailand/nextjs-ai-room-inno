/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

type Props = {
  courses: any[];
}

const FeaturesCourse = ({ courses }: Props) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.09em] text-tertiary">
          หลักสูตรทั้งหมด
        </p>
        <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-[0.005em] sm:text-5xl">
          เรียนรู้จากผู้ลงมือจริง
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          หลักสูตรที่ออกแบบโดยผู้มีประสบการณ์ตรง สอนจากของจริง
          ไม่มี config ซับซ้อน เริ่มสร้างได้ทันที
        </p>
      </div>

      <div className="mt-14 grid w-full gap-x-6 gap-y-12 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <article key={course.title} className="flex flex-col">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border bg-muted">
              <Image
                alt={course.title}
                className="size-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={course.picture}
                loading="eager"
              />
            </div>
            <div className="flex flex-1 flex-col px-1 pt-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="tertiary" className="text-[11px] font-bold uppercase tracking-[0.09em]">
                  หลักสูตร
                </Badge>
                <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-[0.09em]">
                  <Clock className="size-3" /> เรียนรู้ได้ตลอดชีพ
                </Badge>
              </div>
              <h3 className="mt-3 font-heading text-[22px] font-semibold leading-snug tracking-[-0.015em]">
                {course.title}
              </h3>
              <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-muted-foreground">
                {course.detail}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FeaturesCourse;
